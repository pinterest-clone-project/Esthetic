using Domain.Entities.Notification;

namespace Domain.Interfaces;

public interface INotificationRepository
{
    Task<NotificationEntity> AddAsync(NotificationEntity entity, CancellationToken ct = default);
    Task<List<NotificationEntity>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<(List<NotificationEntity> Items, int TotalCount)> GetPagedByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default);
    Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default);
    Task MarkAsReadAsync(Guid notificationId, CancellationToken ct = default);
    Task DeleteFollowRequestNotificationAsync(Guid actorId, Guid userId, CancellationToken ct = default);
}