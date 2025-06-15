
namespace Deelkast.API.Repositories;

public interface INotificationRepository
{
    Task AddNotificationRequest(int itemId, string userEmail);
    Task<IEnumerable<ItemAvailabilityNotification>> GetPendingNotificationsForItem(int itemId);
    Task UpdateNotification(ItemAvailabilityNotification notification);
    //delete 
    Task DeleteNotification(int id);
}

public class NotificationRepository : GenericRepository<ItemAvailabilityNotification>, INotificationRepository
{
    private readonly ApplicationDbContext _context;

    public NotificationRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task AddNotificationRequest(int itemId, string userEmail)
    {
        var exists = await _context.ItemAvailabilityNotifications
            .AnyAsync(n => n.ItemId == itemId && n.UserEmail == userEmail);

        if (exists)
            return; // Already subscribed for this item

        var notification = new ItemAvailabilityNotification
        {
            ItemId = itemId,
            UserEmail = userEmail,
            RequestedAt = DateTime.Now,
        };

        await _context.ItemAvailabilityNotifications.AddAsync(notification);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ItemAvailabilityNotification>> GetPendingNotificationsForItem(int itemId)
    {
        return await _context.ItemAvailabilityNotifications
            .Where(n => n.ItemId == itemId)
            .ToListAsync();
    }

   

    public async Task UpdateNotification(ItemAvailabilityNotification notification)
    {
        _context.ItemAvailabilityNotifications.Update(notification);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteNotification(int id)
    {
        var notification = await _context.ItemAvailabilityNotifications.FindAsync(id);
        if (notification != null)
        {
            _context.ItemAvailabilityNotifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
    }
    

}



