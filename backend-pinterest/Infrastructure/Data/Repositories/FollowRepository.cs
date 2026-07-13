using Domain.Entities.Follow;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class FollowRepository(AppDbContext context) : BaseRepository<FollowEntity>(context), IFollowRepository
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

    public async Task<List<Guid>> GetFollowerIdsAsync(Guid userId, CancellationToken ct)
    {
        var ids = await context.Follows.Where(f => f.FolloweeId == userId)
             .Select(f => f.FollowerId).ToListAsync(ct);
        return ids;
    }
                                                                    
    public async Task<List<Guid>> GetFollowingIdsAsync(Guid userId, CancellationToken ct)
    {
        return await context.Follows
           .Where(f => f.FollowerId == userId)
           .Select(f => f.FolloweeId)
           .ToListAsync(ct);
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
