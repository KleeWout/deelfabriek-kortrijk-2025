namespace Deelkast.API.Services;


public interface IReservationService
{
    Task<Reservation> CreateReservation(CreateReservationDto dto);

    Task<IEnumerable<ReservationViewDto>> GetAllReservations();

    Task<ReservationViewDto> GetReservationbyId(int id);

    public Task<ReservationViewKioskDto> HandleReservationByCode(int pickupCode);

    public Task<Reservation> GetReservationByCode(int pickupCode);

    public Task<ReservationViewDto> MarkAsPaidAndStarLoan(int pickupCode);

    public Task ExpireOverdueReservations();

    // delete reservation
    public Task DeleteReservation(int id);



}

public class ReservationService : IReservationService
{
    private readonly IGenericRepository<Item> _itemRepo;
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Reservation> _resRepo;

    private readonly IReservationRepository _customreservationRepository;

    private readonly IMapper _mapper;

    public ReservationService(IGenericRepository<Item> itemRepo,
                              IGenericRepository<User> userRepo,
                              IGenericRepository<Reservation> resRepo, IMapper mapper, IReservationRepository customreservationRepository)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _resRepo = resRepo;
        _mapper = mapper;
        _customreservationRepository = customreservationRepository;
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
            .Where(r => r.UserId == dto.UserId && r.LoanEnd == null)
            .ToList();
        if (userReservations.Count >= 2) throw new Exception("User already has 2 active reservations");

        if (item.Status != 0) throw new Exception("Item not available");
        if (dto.Weeks < 1 || dto.Weeks > 2) throw new Exception("-max 2 weeks allowed");

        var now = DateTime.Now;
        var pickupDeadline = now.AddHours(48);
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

        if (reservation.Status == ReservationStatus.Not_Active)
        {
            await _resRepo.UpdateAsync(reservation);
            // ones you paid via payconiq with qr code (still has to be done) ->  MarkAsPaidAndStarLoan(pickupcode)
            return _mapper.Map<ReservationViewKioskDto>(reservation);
        }
        else if (reservation.Status == ReservationStatus.Active)
        {
            reservation.ActualReturnDate = DateTime.Now;
            reservation.Status = ReservationStatus.Completed;
            
            // Update item status back to beschikbaar
            reservation.Item.Status = ItemStatus.Beschikbaar;
            await _itemRepo.UpdateAsync(reservation.Item);
            await _resRepo.UpdateAsync(reservation);
            return _mapper.Map<ReservationViewKioskDto>(reservation);
        }

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

        reservation.LoanStart = DateTime.Now;
        reservation.LoanEnd = reservation.LoanStart.Value.AddDays(reservation.Weeks * 7);
        reservation.Status = ReservationStatus.Active;
        await _resRepo.UpdateAsync(reservation);

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
        reservation.Status = ReservationStatus.Expired;
        reservation.Item.Status = ItemStatus.Beschikbaar;
        await _itemRepo.UpdateAsync(reservation.Item);
        await _resRepo.UpdateAsync(reservation);
    }
}


    private int Generate6DigitCode()
    {
        var random = new Random();
        return random.Next(100000, 999999); // Generates a random 6-digit number
    }
}