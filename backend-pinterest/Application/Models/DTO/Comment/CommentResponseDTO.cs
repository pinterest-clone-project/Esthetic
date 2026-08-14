using Application.Models.DTO.Chat;

namespace Application.Models.DTO.Comment;

public class CommentResponseDTO
{
    public Guid Id { get; set; }
    public Guid PinId { get; set; }
    public Guid UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Username { get; set; } = string.Empty;
    public string UserImage { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
    public List<CommentResponseDTO> Replies { get; set; } = new();
    public List<ReactionGroupDTO> Reactions { get; set; } = new();
    public string? MyReaction { get; set; }
}
