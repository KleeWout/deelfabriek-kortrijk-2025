
namespace Deelkast.API.Models;

//database table nog niet helemaal compleet 
public class Reservation : IEntity
{
    public int Id { get; set; }
    public int PickupCode { get; set; }
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
    public ReservationStatus Status { get; set; } = ReservationStatus.Not_Active;
}




public enum ReservationStatus
{
    Not_Active,
    Active,
    Expired,
    Completed
}

public class ReservationProfile : Profile
{
    public ReservationProfile()
    {
        // In your mapping profile
        CreateMap<Reservation, ReservationViewDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
            .ForMember(dest => dest.ItemTitle, opt => opt.MapFrom(src => src.Item.Title))
            .ForMember(dest => dest.LockerNumber, opt => opt.MapFrom(src => src.Locker.LockerNumber));
        CreateMap<ReservationViewDto, Reservation>();
        CreateMap<Reservation, ReservationViewKioskDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
            .ForMember(dest => dest.LockerNumber, opt => opt.MapFrom(src => src.Locker.LockerNumber));
    }
}