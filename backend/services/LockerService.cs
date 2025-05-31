namespace Deelkast.API.Services;



public interface ILockerService
{
    Task<IEnumerable<Locker>> GetAllLockers();
    Task<Locker> GetLockerById(int id);
    Task AddLocker(Locker locker);
    Task UpdateLocker(Locker locker);
    Task DeleteLocker(int id);
    Task<Locker> GetLockerByNumber(int lockerNumber);
}

public class LockerService : ILockerService
{
    private readonly IGenericRepository<Locker> _lockerRepository;

    private readonly ILockerRepository _lockerCustomRepository;



    public LockerService(IGenericRepository<Locker> lockerRepository, ILockerRepository lockerCustomRepository)
    {
        _lockerRepository = lockerRepository;
        _lockerCustomRepository = lockerCustomRepository;
    }

    public async Task<IEnumerable<Locker>> GetAllLockers()
    {
        return await _lockerRepository.GetAllAsync();
    }

    public async Task<Locker> GetLockerById(int id)
    {
        return await _lockerRepository.GetByIdAsync(id);
    }

    public async Task AddLocker(Locker locker)
    {
        await _lockerRepository.AddAsync(locker);
    }

    public async Task UpdateLocker(Locker locker)
    {
        await _lockerRepository.UpdateAsync(locker);
    }

    public async Task DeleteLocker(int id)
    {
        await _lockerRepository.DeleteAsync(id);
    }

    public async Task<Locker> GetLockerByNumber(int lockerNumber)
    {
        return await _lockerCustomRepository.GetByLockerNumber(lockerNumber);
    }
}