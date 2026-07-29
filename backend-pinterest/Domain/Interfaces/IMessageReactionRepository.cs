using Domain.Entities.Chat;

namespace Domain.Interfaces;

public interface IMessageReactionRepository
{
    Task<List<MessageReactionEntity>> ToggleAsync(Guid messageId, Guid userId, string emoji, CancellationToken ct = default);
}
