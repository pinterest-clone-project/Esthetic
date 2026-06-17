using Application.Models.DTO.User;

namespace Application.Models.DTO.Chat;

public record ChatDTO(Guid Id, UserShortDTO OtherUser, MessageDTO? LastMessage, int UnreadCount, DateTime CreatedAt);