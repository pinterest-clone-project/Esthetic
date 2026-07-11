using Domain.Entities.Follow;

namespace Domain.Interfaces;

public interface IFollowRequestRepository
{
    Task SendRequestAsync(Guid senderId, Guid receiverId, CancellationToken ct = default);
    Task<FollowRequestEntity?> GetPendingAsync(Guid senderId, Guid receiverId, CancellationToken ct = default);
    Task<List<FollowRequestEntity>> GetPendingRequestsForUserAsync(Guid userId, CancellationToken ct = default);
    Task DeleteAsync(FollowRequestEntity request, CancellationToken ct = default);
    Task<bool> HasPendingRequestAsync(Guid senderId, Guid receiverId, CancellationToken ct = default);
}
