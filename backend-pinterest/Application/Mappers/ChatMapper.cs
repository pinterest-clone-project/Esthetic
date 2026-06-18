using Application.Models.DTO.Chat;
using Domain.Entities.Chat;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class ChatMapper
{
    [MapperIgnoreTarget(nameof(ChatDTO.OtherUser))]
    [MapperIgnoreTarget(nameof(ChatDTO.LastMessage))]
    [MapperIgnoreTarget(nameof(ChatDTO.UnreadCount))]
    private partial ChatDTO ToDtoBase(ChatEntity entity);

    public ChatDTO ToDTO(ChatEntity entity, Guid currentUserId, int unreadCount, MessageMapper messageMapper, UserMapper userMapper)
    {
        var dto = ToDtoBase(entity);
        var other = entity.User1Id == currentUserId ? entity.User2 : entity.User1;
        var lastMessage = entity.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();

        return dto with
        {
            OtherUser = userMapper.ToShortDTO(other),
            LastMessage = lastMessage is null ? null : messageMapper.ToDTO(lastMessage),
            UnreadCount = unreadCount
        };
    }
}