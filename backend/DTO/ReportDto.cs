namespace Deelkast.API.DTO;

public class ReportDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string ItemTitle { get; set; }
    public int Rating { get; set; }
    public string Remark { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? LockerId { get; set; }
}