using Application.Common;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class PinLikedNotificationHandler(
    INotificationRepository notificationRepository,
    INotificationNotifier notifier,
    NotificationMapper mapper)
    : INotificationHandler<DomainEventNotification<PinLikedEvent>>
{
    public async Task Handle(DomainEventNotification<PinLikedEvent> e, CancellationToken ct)
    {
        if (e.Event.LikerId == e.Event.PinOwnerId) return;

        var entity = await notificationRepository.AddAsync(new NotificationEntity
        {
            UserId = e.Event.PinOwnerId,
            Type = NotificationType.Like,
            Message = $"{e.Event.LikerUsername} вподобав ваш пін \"{e.Event.PinTitle}\"",
            ActorId = e.Event.LikerId,
            ActorUsername = e.Event.LikerUsername,
            ActorImage = e.Event.LikerImage,
            TargetId = e.Event.PinId
        }, ct);

        await notifier.NotifyAsync(e.Event.PinOwnerId, mapper.ToDTO(entity));
    }
}