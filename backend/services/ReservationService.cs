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

    // delete reservation
    public Task DeleteReservation(int id);

    public Task DeleteReservationByCode(int pickupCode);
}

public class ReservationService : IReservationService
{
    private readonly IGenericRepository<Item> _itemRepo;
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Reservation> _resRepo;

    private readonly IReservationRepository _customreservationRepository;

    private readonly IUserRepository _customUserRepository;

    private readonly IMapper _mapper;

    public ReservationService(IGenericRepository<Item> itemRepo,
                              IGenericRepository<User> userRepo,
                              IGenericRepository<Reservation> resRepo, IMapper mapper, IReservationRepository customreservationRepository, IUserRepository customUserRepository)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _resRepo = resRepo;
        _mapper = mapper;
        _customreservationRepository = customreservationRepository;
        _customUserRepository = customUserRepository;
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

        if (reservation.Status == ReservationStatus.Not_Active)
        {
            // await _resRepo.UpdateAsync(reservation);
            return _mapper.Map<ReservationViewKioskDto>(reservation);
        }
        // else if (reservation.Status == ReservationStatus.Active)
        // {
        //     return await CompleteReservationReturnAsync(reservation);
        // }

        if (reservation.Status == ReservationStatus.Expired)
        {
            throw new Exception("Reservation has expired");
        }

        // if reservation PickupDeadline is passed (48 hours after ReservationDate ), set status to Expired and when expired a exception is thrown 
        // ...
        return _mapper.Map<ReservationViewKioskDto>(reservation);
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

        return _mapper.Map<ReservationViewDto>(reservation);
    }
    public async Task ExpireOverdueReservations()
    {
        var now = DateTime.Now;
        var expiredReservations = await _customreservationRepository.GetOverdueReservations(now);

        foreach (var reservation in expiredReservations)
        {
            // Process each expired reservation in its own transaction
            using (var transaction = await _customreservationRepository.BeginTransactionAsync())
            {
                try
                {
                    reservation.Status = ReservationStatus.Expired;
                    reservation.Item.Status = ItemStatus.Beschikbaar;
                    await _itemRepo.UpdateAsync(reservation.Item);
                    await _resRepo.UpdateAsync(reservation);

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Log the error but continue with other reservations
                    Console.WriteLine($"Failed to expire reservation {reservation.Id}: {ex.Message}");
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
                reservation.ActualReturnDate = DateTime.Now;
                reservation.Status = ReservationStatus.Completed;

                // Update item status back to beschikbaar
                reservation.Item.Status = ItemStatus.Beschikbaar;
                await _itemRepo.UpdateAsync(reservation.Item);
                await _resRepo.UpdateAsync(reservation);

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to complete reservation: {ex.Message}", ex);
            }
        }

        return _mapper.Map<ReservationViewKioskDto>(reservation);
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