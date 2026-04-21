using Domain.Entities.Like;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class LikeRepository(AppDbContext context) : ILikeRepository
{
    public async Task LikeAsync(Guid userId, Guid pinId, CancellationToken ct = default)
    {
        var alreadyLiked = await context.Likes
            .AnyAsync(l => l.UserId == userId && l.PinId == pinId, ct);

        if (!alreadyLiked)
        {
            context.Likes.Add(new LikeEntity
            {
                UserId = userId,
                PinId = pinId,
                CreatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync(ct);
        }
    }

    public async Task UnlikeAsync(Guid userId, Guid pinId, CancellationToken ct = default)
    {
        var like = await context.Likes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.PinId == pinId, ct);

        if (like != null)
        {
            context.Likes.Remove(like);
            await context.SaveChangesAsync(ct);
        }
    }
}