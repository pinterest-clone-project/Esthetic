using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class NotificationRepository(AppDbContext db) : INotificationRepository
{
    public async Task<NotificationEntity> AddAsync(NotificationEntity entity, CancellationToken ct = default)
    {
        await db.Notifications.AddAsync(entity, ct);
        await db.SaveChangesAsync(ct);
        return entity;
    }

    public Task<List<NotificationEntity>> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync(ct);

    public Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default) =>
        db.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead, ct);

    public Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default) =>
        db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), ct);

    public Task MarkAsReadAsync(Guid notificationId, CancellationToken ct = default) =>
        db.Notifications
            .Where(n => n.Id == notificationId)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), ct);

    public async Task DeleteFollowRequestNotificationAsync(Guid actorId, Guid userId, CancellationToken ct = default)
    {
        var notification = await db.Notifications
            .FirstOrDefaultAsync(n => n.ActorId == actorId
                                   && n.UserId == userId
                                   && n.Type == NotificationType.FollowRequest, ct);
        if (notification != null)
        {
            db.Notifications.Remove(notification);
            await db.SaveChangesAsync(ct);
        }
    }
}