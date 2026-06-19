using Application.Common;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class CommentAddedNotificationHandler(
    INotificationRepository notificationRepository,
    INotificationNotifier notifier,
    NotificationMapper mapper)
    : INotificationHandler<DomainEventNotification<CommentAddedEvent>>
{
    public async Task Handle(DomainEventNotification<CommentAddedEvent> notification, CancellationToken ct)
    {
        var e = notification.Event;
        if (e.CommenterId == e.PinOwnerId) return;

        var entity = await notificationRepository.AddAsync(new NotificationEntity
        {
            UserId = e.PinOwnerId,
            Type = NotificationType.Comment,
            Message = $"{e.CommenterUsername} прокоментував ваш пін \"{e.PinTitle}\"",
            ActorId = e.CommenterId,
            ActorUsername = e.CommenterUsername,
            ActorImage = e.CommenterImage,
            TargetId = e.PinId
        }, ct);

        await notifier.NotifyAsync(e.PinOwnerId, mapper.ToDTO(entity));
    }
}