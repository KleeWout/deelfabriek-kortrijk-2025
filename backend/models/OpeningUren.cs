using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class OpeningUren
{
    [Key]
    [JsonPropertyName("idDay")]
    public string IdDay { get; set; }

    [JsonPropertyName("openTimeVm")]
    public TimeSpan? OpenTimeVm { get; set; }

    [JsonPropertyName("closeTimeVm")]
    public TimeSpan? CloseTimeVm { get; set; }

    [JsonPropertyName("openTimeNm")]
    public TimeSpan? OpenTimeNm { get; set; }

    [JsonPropertyName("closeTimeNm")]
    public TimeSpan? CloseTimeNm { get; set; }

    [JsonPropertyName("open")]
    public bool? Open { get; set; }
}