namespace Deelkast.API.DTO;


public class ReservationViewDto
{
    public string PickupCode { get; set; }
    public string ItemTitle { get; set; }
    public decimal TotalPrice { get; set; }
    public string UserName { get; set; }
    public string LockerNumber { get; set; }
    public DateTime? LoanStart { get; set; }
    public DateTime? LoanEnd { get; set; }
    public DateTime? ReservationDate { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    public DateTime? PickupDeadline { get; set; } // 48h deadline
    public ReservationStatus Status { get; set; }
    public int Weeks { get; set; } // Needed for pickup logic
}

public class ReservationViewKioskDto
{
    public string PickupCode { get; set; }
    public decimal TotalPrice { get; set; }
    public string UserName { get; set; }
    public string LockerNumber { get; set; }
    public int Weeks { get; set; } 

    public int ItemId { get; set; }
    public ItemDetailDto? Item { get; set; }
}



public class CreateReservationDto
{
    public newUserDto User { get; set; }
    
    public int ItemId { get; set; }
    public int Weeks { get; set; }
}

public class ReservationCreatedDto
{
    public int PickupCode { get; set; }
    public int? LockerId { get; set; }
    public string PersonName { get; set; }
    public string ItemName { get; set; }
    public DateTime PickupDeadline { get; set; }
    public decimal? Price { get; set; }
}
//
