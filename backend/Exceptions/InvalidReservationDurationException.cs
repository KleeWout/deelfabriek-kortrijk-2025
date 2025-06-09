namespace Deelkast.API.Exceptions;

public class InvalidReservationDurationException : Exception
{
    public InvalidReservationDurationException() : base("Reservation duration must be between 1 and 2 weeks")
    {
    }
}
