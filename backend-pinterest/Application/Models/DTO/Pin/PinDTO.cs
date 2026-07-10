using Application.Models.DTO.Tag;

namespace Application.Models.DTO.Pin;

public class PinDTO
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string Image { get; set; } = string.Empty;
    public string? SourceUrl { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<TagDTO> Tags { get; set; } = [];
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsLikedByMe { get; set; }
    public string? CreatorName { get; set; }
    public string? CreatorImage { get; set; }
}
