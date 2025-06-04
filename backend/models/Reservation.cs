
namespace Deelkast.API.Models;

//database table nog niet helemaal compleet 
public class Reservation : IEntity
{
    public int Id { get; set; }
    public string PickupCode { get; set; }
    public DateTime ReservationDate { get; set; } = DateTime.UtcNow;
    public DateTime? LoanStart { get; set; }
    public DateTime? LoanEnd { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    public int Weeks { get; set; } // <-- Needed for pickup logic
    public DateTime PickupDeadline { get; set; } // 48h deadline

    [Precision(10, 2)]
    public decimal? TotalPrice { get; set; }

    public int UserId { get; set; }
    public int ItemId { get; set; }
    public int? LockerId { get; set; }

    public User User { get; set; }
    public Item Item { get; set; }
    public Locker Locker { get; set; }
    // public ReservationStatus Status { get; set; } = ReservationStatus.Active;
}




public enum ReservationStatus
{
    Not_Active,
    Active,
    Expired,
    Completed,
    Cancelled
}

public class ReservationProfile : Profile
{
    public ReservationProfile()
    {
        CreateMap<Reservation, ReservationConfirmationDto>();
        CreateMap<CreateReservationDto, Reservation>();
    }
}