

using Application.Common;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Domain.Entities.Notification;
using Domain.Enums;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class PinCreatedNotificationHandler(
    IFollowRepository followRepository,
    INotificationRepository notificationRepository,
    INotificationNotifier notifier,
    NotificationMapper mapper) 
    : INotificationHandler<DomainEventNotification<PinCreatedEvent>>
{
    public async Task Handle (DomainEventNotification<PinCreatedEvent> e, CancellationToken ct)
    {
        var followerIds = await followRepository.GetFollowerIdsAsync(e.Event.CreatorId, ct);

        foreach(var followerId in followerIds)
        {
            var entity = await notificationRepository.AddAsync(new NotificationEntity
            {
                UserId = followerId,
                Type = NotificationType.NewPin,
                Message = $"{e.Event.CreatorUsername} створив новий пін \"{e.Event.PinTitle}\"",
                ActorId = e.Event.CreatorId,
                ActorUsername = e.Event.CreatorUsername,
                ActorImage = e.Event.CreatorImage,
                TargetId = e.Event.PinId
            }, ct);

            await notifier.NotifyAsync(followerId, mapper.ToDTO(entity));
        }
    }
}
