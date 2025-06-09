namespace Deelkast.API.Exceptions;

public class ReservationLimitExceededException : Exception
{
    public ReservationLimitExceededException(int userId) : base($"User with ID {userId} already has the maximum allowed active reservations")
    {
    }
}
