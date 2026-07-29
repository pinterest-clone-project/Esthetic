using Application.Models.DTO.Chat;

namespace Application.Interfaces.Notifiers;

public interface IChatNotifier
{
    Task NotifyNewMessageAsync(Guid receiverId, MessageDTO message);
    Task NotifyNewChatAsync(Guid receiverId, ChatDTO chat);
    Task NotifyReactionUpdatedAsync(Guid receiverId, Guid messageId, IEnumerable<ReactionGroupDTO> reactions);
}