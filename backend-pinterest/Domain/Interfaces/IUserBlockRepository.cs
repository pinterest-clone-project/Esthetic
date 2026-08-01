namespace Domain.Interfaces;

public interface IUserBlockRepository
{
    Task BlockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
    Task UnblockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
    Task<bool> IsBlockedAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default);
}
