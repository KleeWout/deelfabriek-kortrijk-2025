using Microsoft.AspNetCore.Mvc;

namespace Deelkast.API.Repositories;



public interface IItemRepository
{
    Task<List<Item>> GetItems();
    Task<List<Item>> GetAvailableItemsAsync();
    Task<Item> UpdateItem(int id, Item updatedItem);

    Task<Item?> GetItemById(int id);

    Task<List<Item>> GetItemsWithLocker();

    Task DeleteCategory(string category);

    Task<int> CurrentAvailableItems();

    Task<int> CurrentLoanedItems();

    // Task<List<Item>> GetItemsByCategoryAsync(int categoryId);
    // Task UpdateItemWithCategories(Item item);
    // Task<Item> GetItemByIdWithCategories(int id);
}

public class ItemRepository : GenericRepository<Item>, IItemRepository
{
    private readonly ApplicationDbContext _context;

    public ItemRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    // public async Task<List<Item>> GetItemsByCategoryAsync(int categoryId)
    // {
    //     return await _context.Items
    //         .Include(i => i.ItemCategories)
    //             .ThenInclude(ic => ic.Category)
    //         .Where(i => i.ItemCategories.Any(ic => ic.CategoryId == categoryId))
    //         .ToListAsync();
    // }

    public async Task<List<Item>> GetItems()
    {
        return await _context.Items.ToListAsync();
    }

    public async Task<Item> UpdateItem(int id, Item updatedItem)
    {
        // Get the existing item (tracked by EF Core)
        var existingItem = await _context.Items.FindAsync(id);
        if (existingItem == null)
        {
            throw new InvalidOperationException($"Item with ID {id} not found.");
        }

        // Update properties
        UpdateItemProperties(existingItem, updatedItem);

        // Save changes
        await _context.SaveChangesAsync();

        return existingItem;
    }

    // public async Task<Item> GetItemByIdWithCategories(int id)
    // {
    //     return await _context.Items
    //         .Include(i => i.ItemCategories)
    //             .ThenInclude(ic => ic.Category)
    //         .FirstOrDefaultAsync(i => i.Id == id);
    // }

    public async Task<List<Item>> GetAvailableItemsAsync()
    {
        return await _context.Items
            .Where(i => i.Status == ItemStatus.Beschikbaar)
            .ToListAsync();
    }

    public async Task<int> CurrentAvailableItems()
    {
        return await _context.Items
            .CountAsync(i => i.Status == ItemStatus.Beschikbaar);
    }
    public async Task<int> CurrentLoanedItems()
    {
        return await _context.Items
            .CountAsync(i => i.Status == ItemStatus.Geleend);
    }

 
    // public async Task UpdateItemWithCategories(Item item)
    // {
    //     using var transaction = await _context.Database.BeginTransactionAsync();
    //     try
    //     {
    //         // Get the existing item from database
    //         var existingItem = await _context.Items
    //             .Include(i => i.ItemCategories)
    //             .FirstOrDefaultAsync(i => i.Id == item.Id);

    //         if (existingItem == null)
    //         {
    //             throw new InvalidOperationException($"Item with ID {item.Id} not found.");
    //         }

    //         // Update item properties
    //         UpdateItemProperties(existingItem, item);

    //         // Handle categories - remove all existing first
    //         await RemoveExistingCategories(item.Id);

    //         // Add new categories
    //         await AddNewCategories(item.Id, item.ItemCategories);

    //         // Save all changes
    //         await _context.SaveChangesAsync();
    //         await transaction.CommitAsync();
    //     }
    //     catch
    //     {
    //         await transaction.RollbackAsync();
    //         throw;
    //     }
    // }

    // private async Task AddNewCategories(int itemId, ICollection<ItemCategory> newCategories)
    // {
    //     if (newCategories != null && newCategories.Any())
    //     {
    //         var itemCategoriesToAdd = newCategories.Select(ic => new ItemCategory
    //         {
    //             ItemId = itemId,
    //             CategoryId = ic.CategoryId
    //         }).ToList();

    //         await _context.ItemCategories.AddRangeAsync(itemCategoriesToAdd);
    //     }
    // }

    private void UpdateItemProperties(Item existingItem, Item updatedItem)
    {
        existingItem.Title = updatedItem.Title;
        existingItem.Description = updatedItem.Description;
        existingItem.PricePerWeek = updatedItem.PricePerWeek;
        existingItem.Status = updatedItem.Status;
        existingItem.ImageSrc = updatedItem.ImageSrc;
        existingItem.TimesLoaned = updatedItem.TimesLoaned;
        existingItem.HowToUse = updatedItem.HowToUse;
        existingItem.Accesories = updatedItem.Accesories;
        existingItem.Weight = updatedItem.Weight;
        existingItem.Dimensions = updatedItem.Dimensions;
        existingItem.Tip = updatedItem.Tip;
        existingItem.LockerId = updatedItem.LockerId;
        existingItem.Category = updatedItem.Category; // Add the Category property
    }

    // private async Task RemoveExistingCategories(int itemId)
    // {
    //     var existingCategories = await _context.ItemCategories
    //         .Where(ic => ic.ItemId == itemId)
    //         .ToListAsync();

    //     if (existingCategories.Any())
    //     {
    //         _context.ItemCategories.RemoveRange(existingCategories);
    //     }
    // }

    public async Task<Item?> GetItemById(int id)
    {
        return await _context.Items
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == id);
    }
    public async Task<List<Item>> GetItemsWithLocker()
    {
        return await _context.Items
            .Where(i => i.LockerId != null)
        .ToListAsync();
    }
    public async Task DeleteCategory(string category)
    {
        var categoryToDelete = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == category);

        if (categoryToDelete != null)
        {
            _context.Categories.Remove(categoryToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
