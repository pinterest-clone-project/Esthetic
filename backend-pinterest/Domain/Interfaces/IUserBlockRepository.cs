using Domain.Entities.UserBlock;

namespace Domain.Interfaces;

public interface IUserBlockRepository
{
    Task<List<UserBlockEntity>> GetBlockedUsersAsync(Guid blockerId, CancellationToken ct = default);
    Task<List<Guid>> GetBlockedUserIdsAsync(Guid userId, CancellationToken ct = default);
    Task BlockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
    Task UnblockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
    Task<bool> IsBlockedAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
}
