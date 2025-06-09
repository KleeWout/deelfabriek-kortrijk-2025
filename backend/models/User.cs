namespace Deelkast.API.Models;


public class User : IEntity
{
    [Key]
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string? PhoneNumber { get; set; }

    public string Email { get; set; } = string.Empty;

    public bool IsAdmin { get; set; } = false;

    public bool IsBlocked { get; set; } = false;

    [Precision(10, 2)]
    public decimal TotalFine { get; set; } = 0.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Street { get; set; }
        
    public string City { get; set; }
        
    public string? Bus { get; set; }
  
    public string PostalCode { get; set; }



    // public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();



}

  public class UserProfile : Profile
    {
        public UserProfile()
        {
            // Add mapping for User
            CreateMap<newUserDto, User>();
            
            // Add any other mappings your application needs
        }
    }