namespace Application.Models.DTO.Pin;

public class PinSummaryDTO
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string Image { get; set; } = string.Empty;
    public int LikesCount { get; set; }
    public bool IsLikedByMe { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? CategoryName { get; set; }
    public int CommentsCount { get; set; }
    public int TagsCount { get; set; }
}
