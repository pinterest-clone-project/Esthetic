namespace Domain.Interfaces;

public interface IFollowRepository
{
    Task FollowAsync(Guid followerId, Guid followedId, CancellationToken ct = default);
}
