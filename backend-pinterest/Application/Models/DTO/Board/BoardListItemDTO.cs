namespace Application.Models.DTO.Board;

public class BoardListItemDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public bool IsPrivate { get; set; }
    public bool IsArchived { get; set; }
    public int PinsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}