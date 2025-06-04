namespace Deelkast.API.DTO;



public class ReservationConfirmationDto
{
    public string PickupCode { get; set; }
    public string UserName { get; set; }
    public string ItemName { get; set; }
    public string LockerNumber { get; set; }
    public DateTime PickupDeadline { get; set; }
    public DateTime ReturnDeadline { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateReservationDto
{
    public int UserId { get; set; }
    public int ItemId { get; set; }
    public int Weeks { get; set; }
}
