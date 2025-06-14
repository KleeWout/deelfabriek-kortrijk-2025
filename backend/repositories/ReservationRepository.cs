using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
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

    Task<int> CountActiveReservationsForUserAsync(int userId);

    Task<IDbContextTransaction> BeginTransactionAsync();

    Task<int> CountOverdueItemsAsync();
    Task<int> TotalTimesItemsLoanedAsync();


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
            .FirstOrDefaultAsync(r => r.PickupCode == pickupCode)
            ?? throw new Exception($"Reservation with pickup code {pickupCode} not found");
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
            .FirstOrDefaultAsync(r => r.Id == id) ?? throw new Exception($"Reservation with ID {id} not found");
    }

    public async Task<List<Reservation>> GetOverdueReservations(DateTime currentTime)
    {
        return await _context.Reservations
            .Include(r => r.Item)
            .Where(r => r.Status == ReservationStatus.Not_Active && r.PickupDeadline < currentTime)
            .ToListAsync();
    }

    public async Task<int> CountActiveReservationsForUserAsync(int userId)
    {
        return await _context.Reservations
            .CountAsync(r => r.UserId == userId && r.LoanEnd == null);
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        return await _context.Database.BeginTransactionAsync();
    }

    public async Task<int> CountOverdueItemsAsync()
    {
        return await _context.Reservations
            .CountAsync(r => r.Status == ReservationStatus.Active && r.LoanEnd < DateTime.UtcNow);
    }

    public Task<int> TotalTimesItemsLoanedAsync()
    {
        return _context.Items.SumAsync(i => i.TimesLoaned);
    }




}

