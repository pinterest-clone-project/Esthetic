using Domain.Entities.Chat;

namespace Domain.Interfaces;

public interface IMessageRepository
{
    Task<MessageEntity> AddAsync(MessageEntity entity, CancellationToken ct = default);
    Task<List<MessageEntity>> GetChatMessagesAsync(Guid chatId, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(Guid chatId, Guid userId, CancellationToken ct = default);
    Task MarkAsReadAsync(Guid chatId, Guid readerId, CancellationToken ct = default);
}