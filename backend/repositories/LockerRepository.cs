
namespace Deelkast.API.Repositories;


public interface ILockerRepository
{
    Task<Locker?> GetByLockerNumber(int lockerNumber);

    Task<bool> LockerNumberExist(int lockerNumber);

    Task<bool> AnyOtherLockerWithNumber(int id, int lockerNumber);
    
    Task<Locker?> GetLockerByItemId(int itemId);

}


public class LockerRepository : ILockerRepository
{
    private readonly ApplicationDbContext _context;

    public LockerRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Locker?> GetByLockerNumber(int lockerNumber)
    {
        return await _context.Lockers
            .FirstOrDefaultAsync(l => l.LockerNumber == lockerNumber);
    }

    public async Task<bool> LockerNumberExist(int lockerNumber)
    {
        return await _context.Lockers.AnyAsync(l => l.LockerNumber == lockerNumber);
    }
    public async Task<bool> AnyOtherLockerWithNumber(int id, int lockerNumber)
    {
        return await _context.Lockers.AnyAsync(l => l.LockerNumber == lockerNumber && l.Id != id);
    }

    public async Task<Locker?> GetLockerByItemId(int itemId)
    {
        return await _context.Lockers
            .FirstOrDefaultAsync(l => l.ItemId == itemId);
    }

}
