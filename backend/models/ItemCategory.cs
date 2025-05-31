using System.Text.Json.Serialization;

namespace Deelkast.API.Models;


public class ItemCategory
{
    public int ItemId { get; set; }

    [JsonIgnore]
    public Item Item { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
