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
}
