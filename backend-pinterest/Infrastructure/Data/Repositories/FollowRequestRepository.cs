using Domain.Entities.Follow;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class FollowRequestRepository(AppDbContext context) : IFollowRequestRepository
{
    public async Task SendRequestAsync(Guid senderId, Guid receiverId, CancellationToken ct = default)
    {
        context.FollowRequests.Add(new FollowRequestEntity
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = receiverId,
            Status = FollowRequestStatus.Pending,
            CreatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)
        });

        await context.SaveChangesAsync(ct);
    }

    public async Task<FollowRequestEntity?> GetPendingAsync(Guid senderId, Guid receiverId, CancellationToken ct = default)
    {
        return await context.FollowRequests
            .FirstOrDefaultAsync(r =>
                r.SenderId == senderId &&
                r.ReceiverId == receiverId &&
                r.Status == FollowRequestStatus.Pending, ct);
    }

    public async Task<List<FollowRequestEntity>> GetPendingRequestsForUserAsync(Guid userId, CancellationToken ct = default)
    {
        return await context.FollowRequests
            .Include(r => r.Sender)
            .Where(r => r.ReceiverId == userId && r.Status == FollowRequestStatus.Pending)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task DeleteAsync(FollowRequestEntity request, CancellationToken ct = default)
    {
        context.FollowRequests.Remove(request);
        await context.SaveChangesAsync(ct);
    }

    public async Task<bool> HasPendingRequestAsync(Guid senderId, Guid receiverId, CancellationToken ct = default)
    {
        return await context.FollowRequests
            .AnyAsync(r =>
                r.SenderId == senderId &&
                r.ReceiverId == receiverId &&
                r.Status == FollowRequestStatus.Pending, ct);
    }
}
