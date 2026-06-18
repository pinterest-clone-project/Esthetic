using Domain.Entities.Chat;

namespace Domain.Interfaces;

public interface IChatRepository : IBaseRepository<ChatEntity>
{
    Task<ChatEntity?> GetByUsersAsync(Guid userId1, Guid userId2, CancellationToken ct = default);
    Task<List<ChatEntity>> GetUserChatsAsync(Guid userId, CancellationToken ct = default);
}