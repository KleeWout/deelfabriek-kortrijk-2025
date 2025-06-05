using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class OpeningUren
{
    [Key]
    [JsonPropertyName("idDay")]
    public string IdDay { get; set; }

    [JsonPropertyName("openTimeVm")]
    public string? OpenTimeVm { get; set; }

    [JsonPropertyName("closeTimeVm")]
    public string? CloseTimeVm { get; set; }

    [JsonPropertyName("openTimeNm")]
    public string? OpenTimeNm { get; set; }

    [JsonPropertyName("closeTimeNm")]
    public string? CloseTimeNm { get; set; }

    [JsonPropertyName("open")]
    public bool? Open { get; set; }
}