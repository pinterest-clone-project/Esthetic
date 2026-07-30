namespace Application.Models.DTO.Chat;

public record MessageDTO(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Content,
    DateTime SentAt,
    bool IsRead,
    IEnumerable<ReactionGroupDTO> Reactions,
    string? MyReaction);
