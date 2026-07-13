using Application.Common;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class FollowRequestReceivedNotificationHandler(
    INotificationRepository notificationRepository,
    INotificationNotifier notifier,
    NotificationMapper mapper)
    : INotificationHandler<DomainEventNotification<FollowRequestReceivedEvent>>
{
    public async Task Handle(DomainEventNotification<FollowRequestReceivedEvent> e, CancellationToken ct)
    {
        var entity = await notificationRepository.AddAsync(new NotificationEntity
        {
            UserId = e.Event.ReceiverId,
            Type = NotificationType.FollowRequest,
            Message = $"{e.Event.SenderUsername} хоче підписатися на вас",
            ActorId = e.Event.SenderId,
            ActorUsername = e.Event.SenderUsername,
            ActorImage = e.Event.SenderImage,
            TargetId = null
        }, ct);

        await notifier.NotifyAsync(e.Event.ReceiverId, mapper.ToDTO(entity));
    }
}
