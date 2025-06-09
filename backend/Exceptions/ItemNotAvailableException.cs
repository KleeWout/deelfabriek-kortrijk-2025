namespace Deelkast.API.Exceptions;

public class ItemNotAvailableException : Exception
{
    public ItemNotAvailableException(int itemId) : base($"Item with ID {itemId} is not available for reservation")
    {
    }
}
