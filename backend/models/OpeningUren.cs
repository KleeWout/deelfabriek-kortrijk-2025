using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class OpeningHour
{
    [Key]
    [JsonPropertyName("dayId")]
    public string DayId { get; set; } // was IdDay

    [JsonPropertyName("openTimeMorning")]
    public TimeSpan? OpenTimeMorning { get; set; } // was OpenTimeVm

    [JsonPropertyName("closeTimeMorning")]
    public TimeSpan? CloseTimeMorning { get; set; } // was CloseTimeVm

    [JsonPropertyName("openTimeAfternoon")]
    public TimeSpan? OpenTimeAfternoon { get; set; } // was OpenTimeNm

    [JsonPropertyName("closeTimeAfternoon")]
    public TimeSpan? CloseTimeAfternoon { get; set; } // was CloseTimeNm

    [JsonPropertyName("open")]
    public bool Open { get; set; }
}