namespace Domain.Interfaces;

public interface IFollowRepository
{
    Task FollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default);
}
