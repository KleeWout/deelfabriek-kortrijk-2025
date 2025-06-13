namespace Deelkast.API.Models;


public class ItemAvailabilityNotification: IEntity
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int UserId { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow; // default
    public Item Item { get; set; }
    public User User { get; set; }
}
