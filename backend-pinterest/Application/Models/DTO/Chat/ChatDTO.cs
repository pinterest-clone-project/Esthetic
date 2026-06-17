using Application.Models.DTO.User;

namespace Application.Models.DTO.Chat;

public record ChatDTO(Guid Id, DateTime CreatedAt)
{
    public UserShortDTO OtherUser { get; init; } = null!;
    public MessageDTO? LastMessage { get; init; }
    public int UnreadCount { get; init; }
}