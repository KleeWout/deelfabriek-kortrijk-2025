namespace Deelkast.API.DTO;

// Solution 3: Create a DTO and map it
public class ItemDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal PricePerWeek { get; set; }
    public ItemStatus Status { get; set; }

    public string ImageSrc { get; set; }
    public int TimesLoaned { get; set; }
    public string HowToUse { get; set; }
    public string Accesories { get; set; }
    public decimal Weight { get; set; }
    public string Dimensions { get; set; }
    public string Tip { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? LockerId { get; set; }
    public string Category { get; set; }
}

public class ItemsPageDto
{
    public int Id { get; set; }
    public string Title { get; set; }

    public decimal PricePerWeek { get; set; }
    public ItemStatus Status { get; set; }

    public string? ImageSrc { get; set; }

    public string Category { get; set; }

    public int? LockerId { get; set; }

}

public class ItemNameDto
{
    public string Title { get; set; }

}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string IconName { get; set; }
}
