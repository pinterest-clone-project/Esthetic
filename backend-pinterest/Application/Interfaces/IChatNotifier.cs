using Application.Models.DTO.Chat;

namespace Application.Interfaces;

public interface IChatNotifier
{
    Task NotifyNewMessageAsync(Guid receiverId, MessageDTO message);
}