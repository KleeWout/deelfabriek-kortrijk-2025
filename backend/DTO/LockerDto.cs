public class LockerDto
{
    public int Id { get; set; }
    public int LockerNumber { get; set; }
    public int? ItemId { get; set; }
    public string? ItemTitle { get; set; }
}

public class LockerWithItemDto
{
    public int Id { get; set; }
    public int LockerNumber { get; set; }
    public bool IsOpen { get; set; }
    public ItemsPageDto? Item { get; set; }
}