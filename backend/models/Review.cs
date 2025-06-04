namespace Deelkast.API.Models;

// issues moeten er nog bij, oftewel json of iets anders
public class Review : IEntity
{
    [Key]
    public int Id { get; set; }
    public int Rating { get; set; } // 1 to 5 scale
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; }

    public int ItemId { get; set; }
    public Item Item { get; set; }
}