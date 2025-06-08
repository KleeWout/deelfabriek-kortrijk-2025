namespace Deelkast.API.Repositories;


public interface IReservationRepository
{

    // public Task<Reservation> StartLoan();
    // public Task<Reservation> EndLoan();
    //     public Task<Reservation> CancelReservation();

    public Task<Reservation> GetReservationByCode(int pickupCode);

    public Task<Reservation> GetByIdAsync(int id);

    public Task<List<Reservation>> GetAllAsync();
    Task<List<Reservation>> GetOverdueReservations(DateTime currentTime);

}


public class ReservationRepository : IReservationRepository
{

    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Reservation> GetReservationByCode(int pickupCode)
    {
        return await _context.Reservations
            .Include(r => r.Item)
            .Include(r => r.User)
            .Include(r => r.Locker)
            .FirstOrDefaultAsync(r => r.PickupCode == pickupCode);
    }

    public async Task<List<Reservation>> GetAllAsync()
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Item)
            .Include(r => r.Locker)
            .ToListAsync();
    }
    public async Task<Reservation> GetByIdAsync(int id)
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Item)
            .Include(r => r.Locker)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

   public async Task<List<Reservation>> GetOverdueReservations(DateTime currentTime)
    {
        return await _context.Reservations
            .Include(r => r.Item)
            .Where(r => r.Status == ReservationStatus.Not_Active && r.PickupDeadline < currentTime)
            .ToListAsync();
    }


        

}

