using Application.Models.DTO.Chat;
using Domain.Entities.Chat;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class MessageMapper
{
    public MessageDTO ToDTO(MessageEntity entity, Guid currentUserId) => new(
        entity.Id,
        entity.ChatId,
        entity.SenderId,
        entity.Content,
        entity.SentAt,
        entity.IsRead,
        entity.Reactions
            .GroupBy(r => r.Emoji)
            .Select(g => new ReactionGroupDTO(g.Key, g.Count())),
        entity.Reactions.FirstOrDefault(r => r.UserId == currentUserId)?.Emoji
    );
}
