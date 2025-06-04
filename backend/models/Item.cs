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

    public ItemStatus Status { get; set; } = ItemStatus.Beschikbaar;

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
    
    public List<ItemCategory> ItemCategories { get; set; } = new();

}


public enum ItemStatus
{
    Beschikbaar,
    Geleend,
    Niet_Beschikbaar,
    Onderhoud
}

public class ITemProfile : Profile
{
    public ITemProfile()
    {
        CreateMap<Item, ItemNameDto>();
        // This is likely causing the null reference
        CreateMap<Item, ItemDetailDto>()
            .ForMember(dest => dest.CategoryNames, 
                opt => opt.MapFrom(src => src.ItemCategories.Select(ic => ic.Category.Name).ToList()));
        CreateMap<Item, ItemsPageDto>()
            .ForMember(dest => dest.CategoryNames, opt => opt.MapFrom(src =>
                src.ItemCategories.Select(ic => ic.Category.Name).ToList()));
    }
}