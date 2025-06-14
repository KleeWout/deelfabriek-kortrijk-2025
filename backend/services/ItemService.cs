namespace Deelkast.API.Services;

public interface IItemService
{
    Task<List<ItemDetailDto>> GetAllItemsAdmin();
    Task<List<ItemsPageDto>> GetAllItems();
    // Task<ItemDetailDto> GetItemByIdDto(int id);
    Task<Item> GetItemById(int id);
    Task AddItem(Item item);
    Task UpdateItem(Item item);
    Task DeleteItem(int id);

    // Task<List<ItemsPageDto>> GetItemsByCategoryAsync(int categoryId);
    Task<List<ItemNameDto>> GetAvailableItems();

    Task<int> CurrentAvailableItems();
    Task<int> CurrentLoanedItems();

    // category related methods

    // Task<Item> GetItemByIdWithCategories(int id);
    Task<IEnumerable<CategoryDto>> GetAllCategories();
    // Task<Category> GetCategoryById(int id);
    Task AddCategory(Category category);
    Task DeleteCategory(string category);

    Task<List<ItemsPageDto>> GetItemsWithLocker();

    // Task UpdateItemWithCategories(Item item);

    // ------------------- notifications 
    Task AddNotificationRequest(int itemId, int userId);
    Task UpdateNotification(ItemAvailabilityNotification notification);
    Task DeleteNotification(int id);

}


public class ItemService : IItemService
{

    private readonly IGenericRepository<Item> _itemRepository;
    private readonly IGenericRepository<Category> _categoryRepository;
    private readonly ILockerRepository _lockerRepository;

    private readonly IItemRepository _customItemRepository;

    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;

    public ItemService(
    IGenericRepository<Item> itemRepository,
    IItemRepository customItemRepository,
    IGenericRepository<Category> categoryRepository,
    ILockerRepository lockerRepository,
    IMapper mapper, INotificationRepository notificationRepository)
    {
        _itemRepository = itemRepository;
        _customItemRepository = customItemRepository;
        _categoryRepository = categoryRepository;
        _lockerRepository = lockerRepository;
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }


    public async Task<List<ItemDetailDto>> GetAllItemsAdmin()
    {
        var items = await _customItemRepository.GetItems();
        return _mapper.Map<List<ItemDetailDto>>(items);
    }

    public async Task<List<ItemsPageDto>> GetAllItems()
    {
        // Haal alle items op
        var items = await _customItemRepository.GetItems();

        // // Filter enkel items die een LockerId hebben (dus fysiek beschikbaar zijn)
        // var itemsWithLockers = items.Where(i => i.LockerId != null).ToList();

        // Map naar DTO en retourneer
        return _mapper.Map<List<ItemsPageDto>>(items);
    }


    public async Task<Item> GetItemById(int id)
    {
        return await _itemRepository.GetByIdAsync(id);
    }

    // public async Task<Item> GetItemByIdWithCategories(int id)
    // {
    //     return await _customItemRepository.GetItemByIdWithCategories(id);

    // }

    // public async Task<ItemDetailDto> GetItemByIdDto(int id)
    // {
    //     var item = await _customItemRepository.GetItemByIdWithCategories(id);
    //     if (item == null)
    //     {
    //         return null; // or throw an exception, depending on your error handling strategy
    //     }
    //     return _mapper.Map<ItemDetailDto>(item);

    // }

    public async Task<int> CurrentAvailableItems()
    {
        return await _customItemRepository.CurrentAvailableItems();
    }
    
    public async Task<int> CurrentLoanedItems()
    {
        return await _customItemRepository.CurrentLoanedItems();
    }

    public async Task AddItem(Item item)
    {
        await _itemRepository.AddAsync(item);
    }

    public async Task UpdateItem(Item item)
    {
        // Use the custom repository method to avoid tracking issues
        await _customItemRepository.UpdateItem(item.Id, item);
    }

    // public async Task UpdateItemWithCategories(Item item)
    // {
    //     await _customItemRepository.UpdateItemWithCategories(item);
    // }

    public async Task DeleteItem(int id)
    {
        await _itemRepository.DeleteAsync(id);
    }

    // public async Task<List<ItemsPageDto>> GetItemsByCategoryAsync(int categoryId)
    // {
    //     var items = await _customItemRepository.GetItemsByCategoryAsync(categoryId);
    //     return _mapper.Map<List<ItemsPageDto>>(items);
    // }



    public async Task<List<ItemNameDto>> GetAvailableItems()
    {
        var items = await _customItemRepository.GetAvailableItemsAsync();
        return _mapper.Map<List<ItemNameDto>>(items);
    }

    public async Task<IEnumerable<CategoryDto>> GetAllCategories()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);

    }

    public async Task<Category> GetCategoryById(int id)
    {
        return await _categoryRepository.GetByIdAsync(id);
    }
    public async Task AddCategory(Category category)
    {
        await _categoryRepository.AddAsync(category);
    }

    public async Task DeleteCategory(string category)
    {
        await _customItemRepository.DeleteCategory(category);
    }


    public async Task<List<ItemsPageDto>> GetItemsWithLocker()
    {
        var items = await _customItemRepository.GetItemsWithLocker();
        return _mapper.Map<List<ItemsPageDto>>(items);
    }

    public async Task AddNotificationRequest(int itemId, int userId)
    {
        await _notificationRepository.AddNotificationRequest(itemId, userId);
    }
    public async Task UpdateNotification(ItemAvailabilityNotification notification)
    {
        await _notificationRepository.UpdateNotification(notification);
    }
    public async Task DeleteNotification(int id)
    {
        await _notificationRepository.DeleteNotification(id);
    }
}