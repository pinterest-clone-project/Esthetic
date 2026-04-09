namespace Domain.Interfaces;

public interface IFollowRepository
{
    Task FollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default);
    Task UnfollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default);
}
