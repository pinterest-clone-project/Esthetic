using Domain.Entities.UserBlock;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class UserBlockRepository(AppDbContext context) : IUserBlockRepository
{
    public async Task BlockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default)
    {
        var exists = await context.UserBlocks
            .AnyAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId, ct);

        if (!exists)
        {
            context.UserBlocks.Add(new UserBlockEntity
            {
                BlockerId = blockerId,
                BlockedId = blockedId,
                CreatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync(ct);
        }
    }

    public async Task UnblockAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default)
    {
        var block = await context.UserBlocks
            .FirstOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId, ct);

        if (block != null)
        {
            context.UserBlocks.Remove(block);
            await context.SaveChangesAsync(ct);
        }
    }

    public async Task<bool> IsBlockedAsync(Guid blockerId, Guid blockedId, CancellationToken ct = default)
    => await context.UserBlocks
        .AnyAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId, ct);
}
