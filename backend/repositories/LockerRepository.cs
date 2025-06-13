
namespace Deelkast.API.Repositories;


public interface ILockerRepository
{
    Task<Locker?> GetByLockerNumber(int lockerNumber);

    Task<bool> LockerNumberExist(int lockerNumber);

    Task<bool> AnyOtherLockerWithNumber(int id, int lockerNumber);

    Task<Locker?> GetLockerByItemId(int itemId);


    Task<List<LockerDto>> GetAllLockersAsync();

    Task<List<Locker>> GetAllEmptyLockersAsync();

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

    public async Task<List<LockerDto>> GetAllLockersAsync()
    {
        return await _context.Lockers
        .Select(l => new LockerDto
        {
            Id = l.Id,
            LockerNumber = l.LockerNumber,
            ItemId = l.ItemId,
            ItemTitle = l.Item != null ? l.Item.Title : null
        })
        .ToListAsync();
    }

    public async Task<List<Locker>> GetAllEmptyLockersAsync()
    {
        return await _context.Lockers
            .Where(i => i.ItemId == null)
            .ToListAsync();
    }

}
