namespace Application.Models.DTO.Follow;

public class FollowRequestDTO
{
    public Guid SenderId { get; set; }
    public string SenderUsername { get; set; } = "";
    public string? SenderImage { get; set; }
    public DateTime CreatedAt { get; set; }
}
