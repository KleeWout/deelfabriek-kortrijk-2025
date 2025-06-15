namespace Deelkast.API.Models;


public class Item : IEntity
{
    [Key]
    public int Id { get; set; }

    [MaxLength(100)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    [Precision(10, 2)]
    public decimal? PricePerWeek { get; set; }

    public ItemStatus Status { get; set; } = ItemStatus.Ongebruikt;

    public string? ImageSrc { get; set; }

    public int TimesLoaned { get; set; } = 0;

    public string? HowToUse { get; set; }

    public string? Accesories { get; set; }

    [Precision(10, 2)]
    public decimal? Weight { get; set; }

    [MaxLength(100)]
    public string? Dimensions { get; set; }

    public string? Tip { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? LockerId { get; set; }
    public Locker? Locker { get; set; }
    
    public string? Category { get; set; }

}


public enum ItemStatus
{
    Beschikbaar,
    Geleend,
    Niet_Beschikbaar,
    In_onderhoud,
    Ongebruikt
}

public class ITemProfile : Profile
{
    public ITemProfile()
    {
        CreateMap<Item, ItemNameDto>();
        CreateMap<Item, ItemDetailDto>()
            .ForMember(dest => dest.Category, 
            opt => opt.MapFrom(src => src.Category));
        CreateMap<Item, ItemsPageDto>()
            .ForMember(dest => dest.Category, 
            opt => opt.MapFrom(src => src.Category));
    }
}