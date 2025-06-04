namespace Deelkast.API.Models;


public class Locker : IEntity
{
    [Key]
    public int Id { get; set; }

    public int LockerNumber { get; set; }

    public bool IsOpen { get; set; } = false;

    public int? ItemId { get; set; }

    public Item? Item { get; set; }

}

public class LockerProfile : Profile
{
    public LockerProfile()
    {
        CreateMap<Locker, LockerDto>();
        CreateMap<LockerDto, Locker>();
    }
}
