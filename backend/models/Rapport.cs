namespace Deelkast.API.Models;

// issues moeten er nog bij, oftewel json of iets anders
public class Report : IEntity
{
    [Key]
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public Reservation Reservation { get; set; }
    public int? Rating { get; set; }
    public string? Remark { get; set; }
    public bool Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Report, ReportDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Reservation.User.Email))
            .ForMember(dest => dest.ItemTitle, opt => opt.MapFrom(src => src.Reservation.Item.Title))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.LockerId, opt => opt.MapFrom(src => src.Reservation.LockerId));
    }
}