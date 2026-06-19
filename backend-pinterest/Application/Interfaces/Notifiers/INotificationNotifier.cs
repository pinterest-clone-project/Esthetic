using Application.Models.DTO.Notification;

namespace Application.Interfaces.Notifiers;

public interface INotificationNotifier
{
    Task NotifyAsync(Guid userId, NotificationDTO notification);
}