namespace Deelkast.API.Exceptions;

public class NoLockerAssignedException : Exception
{
    public NoLockerAssignedException(int itemId) : base($"Item with ID {itemId} does not have an assigned locker")
    {
    }
}
