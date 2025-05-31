
namespace Deelkast.API.Models;



public class Reservation
{
    [Key]
    public int Id { get; set; }



    [MaxLength(20)]
    public string? PickupCode { get; set; }

    public DateTime ReservationDate { get; set; } = DateTime.UtcNow;

    public DateTime? LoanStart { get; set; }

    public DateTime? LoanEnd { get; set; }

    public DateTime? ActualReturnDate { get; set; }

    // public ReservationStatus Status { get; set; } = ReservationStatus.Active;

    public bool isBlocked { get; set; } = false;

    public int UserId { get; set; }
    public User User { get; set; }
        
    public int ItemId { get; set; }
    public Item Item { get; set; }
        
    public int? LockerId { get; set; }
    public Locker? Locker { get; set; }


    // // Navigation properties
    // [ForeignKey("UserId")]
    // public virtual User User { get; set; } = null!;

    // [ForeignKey("ItemId")]
    // public virtual Item Item { get; set; } = null!;

}


// public enum ReservationStatus
// {
//     Active,
//     Expired,
//     Completed,
//     Cancelled
// }