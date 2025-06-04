namespace Deelkast.API.Services;


public interface IReservationService
{
    Task<Reservation> CreateReservation(CreateReservationDto dto);

    Task<IEnumerable<Reservation>> GetAllReservations();

    Task<ReservationConfirmationDto> GetReservationbyId(int id);


}

public class ReservationService : IReservationService
{
    private readonly IGenericRepository<Item> _itemRepo;
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Reservation> _resRepo;

    private readonly IMapper _mapper;

    public ReservationService(IGenericRepository<Item> itemRepo,
                              IGenericRepository<User> userRepo,
                              IGenericRepository<Reservation> resRepo, IMapper mapper)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _resRepo = resRepo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<Reservation>> GetAllReservations()
    {
        return await _resRepo.GetAllAsync();
    }

    public async Task<ReservationConfirmationDto> GetReservationbyId(int id)
    {
        var reservation = await _resRepo.GetByIdAsync(id);
        if (reservation == null) throw new Exception("Reservation not found");
        return _mapper.Map<ReservationConfirmationDto>(reservation);
        }



    public async Task<Reservation> CreateReservation(CreateReservationDto dto)
    {
        var user = await _userRepo.GetByIdAsync(dto.UserId);
        var item = await _itemRepo.GetByIdAsync(dto.ItemId);

        if (user == null) throw new Exception("User not found");
        if (item == null) throw new Exception("Item not found");
        if (item.Status != 0) throw new Exception("Item not available");
        if (dto.Weeks < 1 || dto.Weeks > 2) throw new Exception("-max 2 weeks allowed");

        var now = DateTime.UtcNow;
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


    private string Generate6DigitCode()
    {
        var rand = new Random();
        return rand.Next(100000, 999999).ToString();
    }
}