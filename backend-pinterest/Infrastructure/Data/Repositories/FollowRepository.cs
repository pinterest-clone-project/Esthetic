using Domain.Entities.Follow;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class FollowRepository(AppDbContext context) : IFollowRepository
{
    public async Task FollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default)
    {
        context.Follows.Add(new FollowEntity
        {
            FollowerId = followerId,
            FolloweeId = followeeId,
            CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)
        });

        await context.SaveChangesAsync();
    }

    public Task UnfollowAsync(Guid followerId, Guid followeeId, CancellationToken ct = default)
    {
        var follow = context.Follows.FirstOrDefault(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
        if (follow != null)
        {
            context.Follows.Remove(follow);
            return context.SaveChangesAsync(ct);
        }
        return Task.CompletedTask;
    }
}
