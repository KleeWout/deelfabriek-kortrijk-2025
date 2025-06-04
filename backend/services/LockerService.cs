namespace Deelkast.API.Services;



public interface ILockerService
{
    Task<IEnumerable<Locker>> GetAllLockers();
    Task<Locker> GetLockerById(int id);
    Task<LockerDto> AddLocker(Locker locker);
    Task<LockerDto> UpdateLocker(int id, Locker locker);
    Task DeleteLocker(int id);
    Task<Locker> GetLockerByNumber(int lockerNumber);
    Task<bool> LockerNumberExist(int lockerNumber);

    Task<bool> AnyOtherLockerWithNumber(int id, int lockerNumber);
    
}

public class LockerService : ILockerService
{
    private readonly IGenericRepository<Locker> _lockerRepository;

    private readonly ILockerRepository _lockerCustomRepository;

    private readonly IGenericRepository<Item> _itemRepository;

    private readonly IMapper _mapper;

    public LockerService(IGenericRepository<Locker> lockerRepository, ILockerRepository lockerCustomRepository, IMapper mapper, IGenericRepository<Item> itemRepository)
    {
        _lockerRepository = lockerRepository;
        _lockerCustomRepository = lockerCustomRepository;
        _mapper = mapper;
        _itemRepository = itemRepository;     
    }

    public async Task<IEnumerable<Locker>> GetAllLockers()
    {
        return await _lockerRepository.GetAllAsync();
    }

    public async Task<Locker> GetLockerById(int id)
    {
        return await _lockerRepository.GetByIdAsync(id);
    }
    
    public async Task<LockerDto> AddLocker(Locker locker)
    {
        if (locker.ItemId.HasValue)
        {
            var item = await _itemRepository.GetByIdAsync(locker.ItemId.Value);
            if (item == null)
                throw new Exception("Item does not exist.");
       

            var oldLocker = await _lockerCustomRepository.GetLockerByItemId(locker.ItemId.Value);
            if (oldLocker != null) // als de locker een oude item id geeft 
            {
                oldLocker.ItemId = null; //zet op nul 
                await _lockerRepository.UpdateAsync(oldLocker);
            }
        }

        await _lockerRepository.AddAsync(locker);

        return _mapper.Map<LockerDto>(locker);
    }

    public async Task<LockerDto> UpdateLocker(int id, Locker locker)
    {
        var existing = await _lockerRepository.GetByIdAsync(id);
        if (existing == null)
            throw new Exception("Locker not found.");

        // If the locker is changing ItemId
        if (locker.ItemId.HasValue)
        {
            var newItem = await _itemRepository.GetByIdAsync(locker.ItemId.Value);
            if (newItem == null)
                throw new Exception("Item does not exist.");

            // Check if any locker is already using this item
            var oldlocker = await _lockerCustomRepository.GetLockerByItemId(locker.ItemId.Value);
            if (oldlocker != null && oldlocker.Id != id)
            {
                oldlocker.ItemId = null;
                await _lockerRepository.UpdateAsync(oldlocker);
            }

            // Also, clear old item's LockerId if changing item
            if (existing.ItemId.HasValue && existing.ItemId != locker.ItemId)
            {
                var oldItem = await _itemRepository.GetByIdAsync(existing.ItemId.Value);
                if (oldItem != null)
                {
                    oldItem.LockerId = null;
                    await _itemRepository.UpdateAsync(oldItem);
                }
            }

            // update lockerid item 
            newItem.LockerId = id;
            await _itemRepository.UpdateAsync(newItem);
        }
        else if (existing.ItemId.HasValue && !locker.ItemId.HasValue)
        {
            // If removing item from locker, clear lockerId on the item too
            var item = await _itemRepository.GetByIdAsync(existing.ItemId.Value);
            if (item != null)
            {
                item.LockerId = null;
                await _itemRepository.UpdateAsync(item);
            }
        }

        // Update locker
        existing.LockerNumber = locker.LockerNumber;
        existing.ItemId = locker.ItemId;

        await _lockerRepository.UpdateAsync(existing);

        return _mapper.Map<LockerDto>(existing);
    }

    public async Task DeleteLocker(int id)
    {
        await _lockerRepository.DeleteAsync(id);
    }

    public async Task<Locker> GetLockerByNumber(int lockerNumber)
    {
        return await _lockerCustomRepository.GetByLockerNumber(lockerNumber);
    }

    public async Task<bool> LockerNumberExist(int lockerNumber)
    {
        return await _lockerCustomRepository.LockerNumberExist(lockerNumber);
    }

    public async Task<bool> AnyOtherLockerWithNumber(int id, int lockerNumber)
    {
        return await _lockerCustomRepository.AnyOtherLockerWithNumber(id, lockerNumber);
    }
}