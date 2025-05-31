
namespace Deelkast.API.Repositories;


public interface ILockerRepository 
{
    Task<Locker> GetByLockerNumber(int lockerNumber);

}


public class LockerRepository : ILockerRepository
{
    private readonly IGenericRepository<Locker> _genericRepository;

    public LockerRepository(IGenericRepository<Locker> genericRepository)
    {
        _genericRepository = genericRepository;
    }

    public async Task<Locker> GetByLockerNumber(int lockerNumber)
    {
        var lockers = await _genericRepository.GetAllAsync();
        return lockers.FirstOrDefault(l => l.LockerNumber == lockerNumber);
    }
}
