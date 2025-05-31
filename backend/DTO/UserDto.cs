namespace Deelkast.API.DTO;



public class UserCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string? PhoneNumber { get; set; }
    
    public string Email { get; set; }
    
    public AddressCreateDto Address { get; set; }
}



public class AddressCreateDto
{
    [MaxLength(200)]
    public string Street { get; set; }

    [MaxLength(100)]
    public string City { get; set; }

    public string? Bus { get; set; }

    [MaxLength(10)]
    public string PostalCode { get; set; }
}