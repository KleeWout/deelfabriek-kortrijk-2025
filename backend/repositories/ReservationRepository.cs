namespace Deelkast.API.Repositories;


public interface IReservationRepository
{

        // public Task<Reservation> StartLoan();
        // public Task<Reservation> EndLoan();
    //     public Task<Reservation> CancelReservation();
}


public class ReservationRepository : IReservationRepository
{

    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    }



