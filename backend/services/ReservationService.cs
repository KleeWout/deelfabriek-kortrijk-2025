namespace Deelkast.API.Services;


public interface IReservationService
{
    Task<Reservation> CreateReservation(CreateReservationDto dto);
    Task<IEnumerable<ReservationViewDto>> GetAllReservations();
    Task<ReservationViewDto> GetReservationbyId(int id);
    public Task<ReservationViewKioskDto> HandleReservationByCode(int pickupCode);
    public Task<Reservation> GetReservationByCode(int pickupCode);
    public Task<ReservationViewDto> MarkAsPaidAndStarLoan(int pickupCode);
    public Task DeleteReservation(int id);
    // expire overdue reservations
    public Task ExpireOverdueReservations();

    //boetesysteem
    Task ProcessOverdueLoansAndFines();
    Task<decimal> CalculateFineForReservation(int reservationId);

    Task<ReservationViewKioskDto> ProcessFinePaymentAndCompleteReturn(int pickupCode);

    Task SendReturnReminders48Hours();

    Task NotifyUsersItemAvailable(Item item);

}

public class ReservationService : IReservationService
{
    private readonly IGenericRepository<Item> _itemRepo;
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Reservation> _resRepo;

    private readonly IReservationRepository _customreservationRepository;

    private readonly IEmailNotificationService _emailService;

    private readonly INotificationRepository _itemAvailabilityNotificationRepo;

    private readonly IMapper _mapper;

    public ReservationService(IGenericRepository<Item> itemRepo,
                              IGenericRepository<User> userRepo,
                              IGenericRepository<Reservation> resRepo, IMapper mapper, IReservationRepository customreservationRepository, IEmailNotificationService emailService, INotificationRepository itemAvailabilityNotificationRepo)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _resRepo = resRepo;
        _mapper = mapper;
        _customreservationRepository = customreservationRepository;
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

    public async Task DeleteReservation(int id)
    {
        var reservation = await _customreservationRepository.GetByIdAsync(id);
        if (reservation == null) throw new Exception("Reservation not found");

        // Change item status back to beschikbaar
        var item = await _itemRepo.GetByIdAsync(reservation.ItemId);
        if (item != null)
        {
            item.Status = ItemStatus.Beschikbaar;
            await _itemRepo.UpdateAsync(item);
        }

        await _resRepo.DeleteAsync(id);
    }



    public async Task<Reservation> CreateReservation(CreateReservationDto dto)
    {
        var user = await _userRepo.GetByIdAsync(dto.UserId);
        var item = await _itemRepo.GetByIdAsync(dto.ItemId);

        if (user == null) throw new Exception("User not found");
        if (item == null) throw new Exception("Item not found");
        // een user kan maar 2 reserveringen tegelijk hebben
        var activeReservations = await _resRepo.GetAllAsync();
        var userReservations = activeReservations
        .Where(r => r.UserId == dto.UserId && 
            (r.Status == ReservationStatus.Active || r.Status == ReservationStatus.Not_Active))
        .ToList();   
        if (userReservations.Count >= 2) throw new Exception("User already has 2 active reservations");

        if (item.Status != 0) throw new Exception("Item not available");
        if (dto.Weeks < 1 || dto.Weeks > 2) throw new Exception("-max 2 weeks allowed");

        var now = DateTime.Now;
        var pickupDeadline = now.AddHours(72);
        var totalPrice = item.PricePerWeek * dto.Weeks;

        if (item.LockerId == null)
            throw new Exception("Item does not have an assigned LockerId");

        var reservation = new Reservation
        {
            UserId = dto.UserId,
            ItemId = dto.ItemId,
            LockerId = (int)item.LockerId,
            PickupCode = Generate6DigitCode(),
            ReservationDate = now,
            PickupDeadline = pickupDeadline,
            Weeks = dto.Weeks,
            LoanStart = null,
            LoanEnd = null,
            TotalPrice = totalPrice
        };
        // change item status to geleend 
        item.Status = ItemStatus.Geleend;
        item.TimesLoaned += 1;
        // update item in repo
        await _itemRepo.UpdateAsync(item);

        await _resRepo.AddAsync(reservation);
        try
        {
            await _emailService.SendReservationConfirmation(user, item, reservation);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending reservation confirmation email: {ex.Message}");
            throw;
        }
        return reservation;
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
            await _resRepo.UpdateAsync(reservation);
            // ones you paid via payconiq with qr code (still has to be done) ->  MarkAsPaidAndStarLoan(pickupcode)
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
            else
            {
                // No fine, complete the return immediately
                return await CompleteReturn(reservation);
            }
        }

        if (reservation.Status == ReservationStatus.Expired)
        {
            throw new Exception("Reservation has expired");
        }
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

        reservation.LoanStart = DateTime.Now;
        reservation.LoanEnd = reservation.LoanStart.Value.AddDays(reservation.Weeks * 7);
        reservation.Status = ReservationStatus.Active;
        await _resRepo.UpdateAsync(reservation);

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
            item.Status = ItemStatus.Beschikbaar;
            reservation.Status = ReservationStatus.Cancelled;
            await NotifyUsersItemAvailable(reservation.Item);
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
        return daysOverdue *0.50m; // €0.50 per dag
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
    }
}