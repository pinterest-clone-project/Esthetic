using Application.Common;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class UserFollowedNotificationHandler(
    INotificationRepository notificationRepository,
    INotificationNotifier notifier,
    NotificationMapper mapper)
    : INotificationHandler<DomainEventNotification<UserFollowedEvent>>
{
    public async Task Handle(DomainEventNotification<UserFollowedEvent> e, CancellationToken ct)
    {
        var entity = await notificationRepository.AddAsync(new NotificationEntity
        {
            UserId = e.Event.FolloweeId,
            Type = NotificationType.Follow,
            Message = $"{e.Event.FollowerUsername} почав стежити за вами",
            ActorId = e.Event.FollowerId,
            ActorUsername = e.Event.FollowerUsername,
            ActorImage = e.Event.FollowerImage,
            TargetId = null
        }, ct);

        await notifier.NotifyAsync(e.Event.FolloweeId, mapper.ToDTO(entity));
    }
}
