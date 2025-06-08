namespace Deelkast.API.Models;

public class Category: IEntity
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        public string IconName { get; set; } 

        // public List<ItemCategory> ItemCategories { get; set; } = new();
    }

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<Category, CategoryDto>();

    }
}

