using System.Text.Json.Serialization;

namespace Application.Models.DTO;

public class GoogleAccountModel
{
    [JsonPropertyName("id")]
    public string GogoleId { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("picture")]
    public string Picture { get; set; } = string.Empty;
}