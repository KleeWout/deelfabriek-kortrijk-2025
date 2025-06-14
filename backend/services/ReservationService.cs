using Deelkast.API.Exceptions;
namespace Deelkast.API.Services;


public interface IReservationService
{
    Task<ReservationCreatedDto> CreateReservation(CreateReservationDto dto);
    Task<IEnumerable<ReservationViewDto>> GetAllReservations();
    Task<ReservationViewDto> GetReservationbyId(int id);
    public Task<ReservationViewKioskDto> HandleReservationByCode(int pickupCode);
    public Task<Reservation> GetReservationByCode(int pickupCode);
    public Task<ReservationViewDto> MarkAsPaidAndStarLoan(int pickupCode);

    public Task<ReservationViewKioskDto> CompleteReservationReturnAsync(Reservation reservation);

    public Task<ReservationViewKioskDto> HandleReservationReturnByCode(int pickupCode);

    public Task ExpireOverdueReservations();

    //boetesysteem
    Task ProcessOverdueLoansAndFines();
    Task<decimal> CalculateFineForReservation(int reservationId);

    public Task DeleteReservationByCode(int pickupCode);

    public Task DeleteReservation(int id);
    Task<ReservationViewKioskDto> ProcessFinePaymentAndCompleteReturn(int pickupCode);

    Task SendReturnReminders48Hours();

    Task NotifyUsersItemAvailable(Item item);

    Task<int> CountOverdueItemsAsync();
    Task<int> TotalTimesItemsLoanedAsync();

}

public class ReservationService : IReservationService
{
    private readonly IGenericRepository<Item> _itemRepo;
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Reservation> _resRepo;

    private readonly IReservationRepository _customreservationRepository;

    private readonly IUserRepository _customUserRepository;

    private readonly IEmailNotificationService _emailService;

    private readonly INotificationRepository _itemAvailabilityNotificationRepo;

    private readonly IMapper _mapper;

    public ReservationService(IGenericRepository<Item> itemRepo,
                              IGenericRepository<User> userRepo,
                              IGenericRepository<Reservation> resRepo, IMapper mapper, IReservationRepository customreservationRepository, IEmailNotificationService emailService, IUserRepository customUserRepository, INotificationRepository itemAvailabilityNotificationRepo)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _resRepo = resRepo;
        _mapper = mapper;
        _customreservationRepository = customreservationRepository;
        _customUserRepository = customUserRepository;
        _emailService = emailService;
        _itemAvailabilityNotificationRepo = itemAvailabilityNotificationRepo;

    }

    public async Task<IEnumerable<ReservationViewDto>> GetAllReservations()
    {
        var reservations = await _customreservationRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<ReservationViewDto>>(reservations);
    }

    public async Task<ReservationViewDto> GetReservationbyId(int id)
    {
        var reservation = await _customreservationRepository.GetByIdAsync(id);
        return _mapper.Map<ReservationViewDto>(reservation);

    }

    public async Task<int> CountOverdueItemsAsync()
    {
        return await _customreservationRepository.CountOverdueItemsAsync();
    }

    public async Task<int> TotalTimesItemsLoanedAsync()
    {
        return await _customreservationRepository.TotalTimesItemsLoanedAsync();
    }
    public async Task DeleteReservation(int id)
    {
        var reservation = await _customreservationRepository.GetByIdAsync(id);
        if (reservation == null) throw new Exception("Reservation not found");

        // Change item status back to beschikbaar
        var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
        if (item == null) throw new ItemNotFoundException($"Item with ID {reservation.ItemId} not found");

        // Use a transaction for consistency
        using (var transaction = await _customreservationRepository.BeginTransactionAsync())
        {
            try
            {
                item.Status = ItemStatus.Beschikbaar;
                await _itemRepo.UpdateAsync(item);
                await _resRepo.DeleteAsync(id);

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to delete reservation: {ex.Message}", ex);
            }
        }
    }
    public async Task DeleteReservationByCode(int pickupCode)
    {
        var reservation = await GetReservationByCode(pickupCode);
        if (reservation == null) throw new Exception("Reservation not found");

        // Change item status back to beschikbaar
        var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
        if (item == null) throw new ItemNotFoundException($"Item with ID {reservation.ItemId} not found");

        // Use a transaction for consistency
        using (var transaction = await _customreservationRepository.BeginTransactionAsync())
        {
            try
            {
                item.Status = ItemStatus.Beschikbaar;
                await _itemRepo.UpdateAsync(item);
                await _resRepo.DeleteAsync(reservation.Id);

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to delete reservation: {ex.Message}", ex);
            }
        }
    }

    public async Task<ReservationCreatedDto> CreateReservation(CreateReservationDto dto)
    {
        // Load necessary data

        //Get userid based on user email or create new user if not exists
        var user = await _customUserRepository.GetUser(dto.User);
        var item = await _itemRepo.GetByIdAsync(dto.ItemId);

        // Validation with proper exception types
        if (item == null) throw new ItemNotFoundException($"Item with ID {dto.ItemId} not found");

        // Check active reservations count using optimized query
        int activeReservationsCount = await _customreservationRepository.CountActiveReservationsForUserAsync(user.Id);
        if (activeReservationsCount >= 2) throw new ReservationLimitExceededException(user.Id);

        // Item availability check with proper enum usage
        if (item.Status != ItemStatus.Beschikbaar) throw new ItemNotAvailableException(dto.ItemId);

        // Duration validation
        if (dto.Weeks < 1 || dto.Weeks > 2) throw new InvalidReservationDurationException();

        // Locker validation
        if (item.LockerId == null) throw new NoLockerAssignedException(dto.ItemId);

        var now = DateTime.Now;
        var pickupDeadline = now.AddHours(48);
        var totalPrice = item.PricePerWeek * dto.Weeks;

        // Create the reservation object
        var reservation = new Reservation
        {
            UserId = user.Id,
            ItemId = dto.ItemId,
            LockerId = item.LockerId,
            PickupCode = await GenerateUnique6DigitCode(), // Using the improved code generator
            ReservationDate = now,
            PickupDeadline = pickupDeadline,
            Weeks = dto.Weeks,
            LoanStart = null,
            LoanEnd = null,
            TotalPrice = totalPrice
        };

        // Use a transaction to ensure consistency
        using (var transaction = await _customreservationRepository.BeginTransactionAsync())
        {
            try
            {
                // Update item status
                item.Status = ItemStatus.Geleend;
                item.TimesLoaned += 1;
                await _itemRepo.UpdateAsync(item);

                // Add reservation
                await _resRepo.AddAsync(reservation);

                // Commit the transaction
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                // Roll back the transaction if anything fails
                await transaction.RollbackAsync();
                throw new Exception($"Failed to create reservation: {ex.Message}", ex);
            }
        }

        // Send email notification AFTER transaction is committed
        // This way, if email fails, the database transaction is already complete
        try
        {
            await _emailService.SendReservationConfirmation(user, item, reservation);
        }
        catch (Exception ex)
        {
            // Log the error but don't throw exception - allow reservation to succeed
            // even if email notification fails
            Console.WriteLine($"Error sending reservation confirmation email: {ex.Message}");
            // We don't rethrow the exception here
        }

        var response = new ReservationCreatedDto
        {
            LockerId = reservation.LockerId,
            PickupCode = reservation.PickupCode,
            ItemName = reservation.Item.Title,
            PersonName = $"{reservation.User.FirstName} {reservation.User.LastName}",
            TotalPrice = reservation.TotalPrice,
            PickupDeadline = reservation.PickupDeadline
        };

        return response;
    }

    // making reservation is already complete 

    // one api with two different responses depending on the status of the reservation /code/{pickupCode}
    // check if pickerupcode exists in the database
    // if the status is not active, its pickup(itemdetail of reservation + prijs reservatie + status reservatie to active)
    // als item betaald is bij pickup (/code/{pickupCode/ispayed}), then the reservation is completed (itemdetail of reservation + open locker + update status reservation) -> update returndate (loanstart + loandate)
    // if the status is active, its for return (return flow(review maken + update item status to beschikbaar  + open locker + update actualreturndate))

    public async Task<Reservation> GetReservationByCode(int pickupCode)
    {

        return await _customreservationRepository.GetReservationByCode(pickupCode);
    }
    public async Task<ReservationViewKioskDto> HandleReservationByCode(int pickupCode)
    {
        var reservation = await GetReservationByCode(pickupCode);
        var now = DateTime.Now;

        if (reservation == null) throw new Exception("Reservation not found");

        var user = await _userRepo.GetByIdAsync(reservation.UserId);
        if (user != null && user.IsBlocked)
        {
            throw new Exception("BLOCKED_USER"); // Special exception type voor frontend
        }

        if (reservation.Status == ReservationStatus.Not_Active)
        {
            // await _resRepo.UpdateAsync(reservation);
            return _mapper.Map<ReservationViewKioskDto>(reservation);
        }
        else if (reservation.Status == ReservationStatus.Active)
        {
            if (user != null && reservation.FineApplied > 0)
            {
                var dto = _mapper.Map<ReservationViewKioskDto>(reservation);
                dto.HasFine = true;
                dto.FineAmount = reservation.FineApplied;
                dto.RequiresPayment = true;
                return dto;
            }
            // else
            // {
            //     // No fine, complete the return immediately
            //     return await CompleteReturn(reservation);
            // }
        }

        if (reservation.Status == ReservationStatus.Expired)
        {
            throw new Exception("Reservation has expired");
        }
        Console.WriteLine("Reservation status is not active or expired, returning reservation details.");
        return _mapper.Map<ReservationViewKioskDto>(reservation);
    }

    // Nieuwe methode voor het afhandelen van fine betaling
    public async Task<ReservationViewKioskDto> ProcessFinePaymentAndCompleteReturn(int pickupCode)
    {
        var reservation = await GetReservationByCode(pickupCode);
        if (reservation == null) throw new Exception("Reservation not found");

        var user = await _userRepo.GetByIdAsync(reservation.UserId);
        if (user == null) throw new Exception("User not found");

        // Reset fine to 0 after payment
        reservation.FineApplied = 0;
        reservation.FineDaysApplied = 0;

        await _userRepo.UpdateAsync(user);

        // Complete the return
        return await CompleteReturn(reservation);
    }

    // Helper methode voor het voltooien van een return
    private async Task<ReservationViewKioskDto> CompleteReturn(Reservation reservation)
    {
        Console.WriteLine("Completing return for reservation...");
        reservation.ActualReturnDate = DateTime.Now;
        reservation.Status = ReservationStatus.Completed;

        // Update item status back to beschikbaar
        reservation.Item.Status = ItemStatus.Beschikbaar;
        await _itemRepo.UpdateAsync(reservation.Item);
        await _resRepo.UpdateAsync(reservation);
        // Send return confirmation email
        try
        {
            var user = await _userRepo.GetByIdAsync(reservation.UserId);
            var item = await _itemRepo.GetByIdAsync(reservation.ItemId);

            if (user != null && item != null)
            {
                // Check if it was returned late
                await _emailService.SendReturnConfirmation(user, item, reservation);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send return confirmation email: {ex.Message}");
        }

        await NotifyUsersItemAvailable(reservation.Item);
        var dto = _mapper.Map<ReservationViewKioskDto>(reservation);
        dto.HasFine = false;
        dto.FineAmount = 0;
        dto.RequiresPayment = false;
        return dto;
    }


    public async Task<ReservationViewDto> MarkAsPaidAndStarLoan(int pickupCode)
    {
        var reservation = await GetReservationByCode(pickupCode);
        if (reservation == null)
            throw new Exception("Reservation not found");
        // if reservation is already completed, expired or active throw exception
        if (reservation.Status != ReservationStatus.Not_Active)
            throw new Exception("Reservation is already active or completed");

        // Use a transaction for consistency
        using (var transaction = await _customreservationRepository.BeginTransactionAsync())
        {
            try
            {
                reservation.LoanStart = DateTime.Now;
                reservation.LoanEnd = reservation.LoanStart.Value.AddDays(reservation.Weeks * 7);
                reservation.Status = ReservationStatus.Active;
                await _resRepo.UpdateAsync(reservation);

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to mark reservation as paid: {ex.Message}", ex);
            }
        }

        // open locker where the item is in that reservation
        // locker.IsOpen = true; 
        // call to an python script to open the locker
        try
        {
            var user = await _userRepo.GetByIdAsync(reservation.UserId);
            var item = await _itemRepo.GetByIdAsync(reservation.ItemId);

            if (user != null && item != null)
            {
                await _emailService.SendPickupConfirmation(user, item, reservation);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send pickup confirmation email: {ex.Message}");
        }

        return _mapper.Map<ReservationViewDto>(reservation);
    }
    public async Task ExpireOverdueReservations()
    {
        var now = DateTime.Now;
        var expiredReservations = await _customreservationRepository.GetOverdueReservations(now);

        foreach (var reservation in expiredReservations)
        {
            reservation.Status = ReservationStatus.Expired;
            if (reservation.Item != null)
            {
                reservation.Item.Status = ItemStatus.Beschikbaar;
                await NotifyUsersItemAvailable(reservation.Item);
                await _itemRepo.UpdateAsync(reservation.Item);
            }
            await _resRepo.UpdateAsync(reservation);
        }
    }
    public async Task ProcessOverdueLoansAndFines()
    {
        var now = DateTime.Now;
        var activeReservations = await _resRepo.GetAllAsync();

        var overdueReservations = activeReservations
            .Where(r => r.Status == ReservationStatus.Active &&
                        r.LoanEnd.HasValue &&
                        r.LoanEnd.Value.Date < now.Date)
            .ToList();

        foreach (var reservation in overdueReservations)
        {
            var user = await _userRepo.GetByIdAsync(reservation.UserId);
            if (user == null) continue;

            var daysOverdue = (now.Date - reservation.LoanEnd.Value.Date).Days;
            var newDaysToFine = daysOverdue - reservation.FineDaysApplied;


            if (newDaysToFine > 0)
            {
                // Calculate new fine amount (0.50 per day)
                var newFineAmount = newDaysToFine * 0.50m;

                // Calculate what the total fine would be
                var potentialTotalFine = reservation.FineApplied + newFineAmount;

                // Cap the total fine at 7 euros
                var actualTotalFine = Math.Min(potentialTotalFine, 7.00m);
                var actualNewFine = actualTotalFine - reservation.FineApplied;


                if (actualNewFine > 0)
                {
                    reservation.FineApplied = actualTotalFine;
                    reservation.FineDaysApplied = daysOverdue; // Track all days we've processed

                    await _resRepo.UpdateAsync(reservation);
                }
            }

            // Block user if fine >= 7
            if (reservation.FineApplied >= 7.00m && !user.IsBlocked)
            {
                reservation.FineApplied = 7; // Cap
                user.IsBlocked = true;
                await _userRepo.UpdateAsync(user);

                var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
                if (item != null)
                {
                    reservation.Status = ReservationStatus.Cancelled;
                    await _itemRepo.UpdateAsync(item);
                }

                if (!reservation.BlockedEmailSent)
                {
                    try
                    {
                        reservation.BlockedEmailSent = true;
                        await _resRepo.UpdateAsync(reservation);
                        await _emailService.SendUserBlockedNotification(user, item, reservation);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send blocked user notification email: {ex.Message}");
                    }
                }
            }

            // Late return notification
            if (!reservation.LateEmailSent)
            {
                try
                {
                    var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
                    if (item != null)
                    {
                        await _emailService.SendReturnLate(user, item, reservation);
                        reservation.LateEmailSent = true;
                        await _resRepo.UpdateAsync(reservation);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send late return notification email: {ex.Message}");
                }
            }
        }
    }



    // Vereenvoudigde methode - geen dubbele logica
    public async Task<decimal> CalculateFineForReservation(int reservationId)
    {
        var reservation = await _customreservationRepository.GetByIdAsync(reservationId);
        if (reservation == null || reservation.Status != ReservationStatus.Active)
            return 0;

        var now = DateTime.Now;
        if (reservation.LoanEnd.Value.Date >= now.Date)
            return 0; // Nog niet over tijd

        var daysOverdue = (now.Date - reservation.LoanEnd.Value.Date).Days;
        return daysOverdue * 0.50m; // €0.50 per dag
    }

    // sendreturnreminder48hours 
    public async Task SendReturnReminders48Hours()
    {
        var now = DateTime.Now;
        var reservations = await _customreservationRepository.GetAllAsync();

        foreach (var reservation in reservations)
        {
            if (reservation.Status == ReservationStatus.Active && reservation.LoanEnd.HasValue)
            {
                var hoursLeft = (reservation.LoanEnd.Value - now).TotalHours;
                if (hoursLeft <= 73 && hoursLeft >= 71 && !reservation.ReminderSent)
                {
                    var user = await _userRepo.GetByIdAsync(reservation.UserId);
                    var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
                    if (user != null && item != null)
                    {
                        await _emailService.SendReturnReminder(user, item, reservation);
                        reservation.ReminderSent = true;
                        await _resRepo.UpdateAsync(reservation);
                    }
                }
            }
        }
    }
    public async Task NotifyUsersItemAvailable(Item item)
    {
        if (item == null) return;

        var notifications = await _itemAvailabilityNotificationRepo.GetPendingNotificationsForItem(item.Id);
        if (notifications == null) return;

        foreach (var notif in notifications)
        {
            if (notif == null) continue;
            var user = await _userRepo.GetByIdAsync(notif.UserId);
            if (user != null)
            {
                try
                {
                    await _emailService.SendItemBackOnlineNotification(user, item);
                    await _itemAvailabilityNotificationRepo.DeleteNotification(notif.Id);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to notify user {user?.Id} about item availability: {ex.Message}");
                }
            }
        }
    }

    private int Generate6DigitCode()
    {
        var random = new Random();
        return random.Next(100000, 999999); // Generates a random 6-digit number
    }    // Handles the return of an item by reservation code
    public async Task<ReservationViewKioskDto> HandleReservationReturnByCode(int pickupCode)
    {
        var reservation = await GetReservationByCode(pickupCode);

        if (reservation == null) throw new Exception("Reservation not found");

        if (reservation.Status != ReservationStatus.Active)
        {
            throw new Exception("Reservation is not active and cannot be returned");
        }

        return await CompleteReservationReturnAsync(reservation);
    }

    // Completes a reservation return process
    public async Task<ReservationViewKioskDto> CompleteReservationReturnAsync(Reservation reservation)
    {
        // Use a transaction for consistency when completing a reservation
        using (var transaction = await _customreservationRepository.BeginTransactionAsync())
        {
            try
            {
                // Update reservation status
                reservation.ActualReturnDate = DateTime.Now;
                reservation.Status = ReservationStatus.Completed;

                // Update item status back to beschikbaar
                reservation.Item.Status = ItemStatus.Beschikbaar;

                // Save both updates
                await _itemRepo.UpdateAsync(reservation.Item);
                await _resRepo.UpdateAsync(reservation);

                // Commit transaction
                await transaction.CommitAsync();

                // Map to DTO first before any non-transactional operations
                var dto = _mapper.Map<ReservationViewKioskDto>(reservation);
                dto.HasFine = false;
                dto.FineAmount = 0;
                dto.RequiresPayment = false;

                // Post-transaction operations (non-critical for data consistency)
                await SendReturnConfirmationEmail(reservation);
                await NotifyUsersItemAvailable(reservation.Item);

                return dto;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to complete reservation: {ex.Message}", ex);
            }
        }
    }

    private async Task SendReturnConfirmationEmail(Reservation reservation)
    {
        try
        {
            var user = await _userRepo.GetByIdAsync(reservation.UserId);
            var item = await _itemRepo.GetByIdAsync(reservation.ItemId);

            if (user != null && item != null)
            {
                await _emailService.SendReturnConfirmation(user, item, reservation);
            }
        }
        catch (Exception ex)
        {
            // Log but don't fail the operation
            Console.WriteLine($"Failed to send return confirmation email: {ex.Message}");
        }
    }

    private async Task<int> GenerateUnique6DigitCode()
    {
        int code;
        bool isUnique = false;

        do
        {
            code = new Random().Next(100000, 999999);
            // Check if code already exists
            try
            {
                var existing = await _customreservationRepository.GetReservationByCode(code);
                // If we get here, a reservation with this code exists
                isUnique = false;
            }
            catch (Exception)
            {
                // If an exception is thrown, no reservation with this code exists
                isUnique = true;
            }
        }
        while (!isUnique);

        return code;
    }
}