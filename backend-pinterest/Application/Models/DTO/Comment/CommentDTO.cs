namespace Application.Models.DTO.Comment;

public class CommentDTO
{
    public Guid Id { get; set; }
    public Guid PinId { get; set; }
    public Guid UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}