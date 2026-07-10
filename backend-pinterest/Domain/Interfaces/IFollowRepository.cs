using Domain.Entities.Follow;

namespace Domain.Interfaces;

public interface IFollowRepository : IBaseRepository<FollowEntity>
{
    Task FollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default);
    Task UnfollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default);
}
