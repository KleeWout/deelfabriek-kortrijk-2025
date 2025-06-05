using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class OpeningsHours
{
    [Key]
    [JsonPropertyName("idDay")]
    public string IdDay { get; set; }

    [JsonPropertyName("openTimeMorning")]
    public TimeSpan? OpenTimeMorning { get; set; }

    [JsonPropertyName("closeTimeMorning")]
    public TimeSpan? CloseTimeMorning { get; set; }

    [JsonPropertyName("openTimeAfternoon")]
    public TimeSpan? OpenTimeAfternoon { get; set; }

    [JsonPropertyName("closeTimeAfternoon")]
    public TimeSpan? CloseTimeAfternoon { get; set; }

    [JsonPropertyName("open")]
    public bool? Open { get; set; }
}
