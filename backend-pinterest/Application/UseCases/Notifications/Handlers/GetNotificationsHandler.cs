using Application.Mappers;
using Application.Models.DTO.Notification;
using Application.UseCases.Notifications.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class GetNotificationsHandler(
    INotificationRepository repository,
    NotificationMapper mapper)
    : IRequestHandler<GetNotificationsQuery, List<NotificationDTO>>
{
    public async Task<List<NotificationDTO>> Handle(GetNotificationsQuery request, CancellationToken ct)
    {
        var notifications = await repository.GetByUserIdAsync(request.UserId, ct);
        return notifications.Select(mapper.ToDTO).ToList();
    }
}
