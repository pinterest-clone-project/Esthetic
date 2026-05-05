namespace Application.Models.DTO.Pin;

public class PinSummaryDTO
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? MediaUrl { get; set; }
    public int LikesCount { get; set; }
}
