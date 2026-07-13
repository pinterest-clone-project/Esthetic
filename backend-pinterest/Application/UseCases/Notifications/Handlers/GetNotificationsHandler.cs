using Application.Mappers;
using Application.Models.DTO;
using Application.Models.DTO.Notification;
using Application.UseCases.Notifications.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class GetNotificationsHandler(
    INotificationRepository repository,
    NotificationMapper mapper)
    : IRequestHandler<GetNotificationsQuery, PagedResult<NotificationDTO>>
{
    public async Task<PagedResult<NotificationDTO>> Handle(GetNotificationsQuery request, CancellationToken ct)
    {
        var (notifications, total) = await repository.GetPagedByUserIdAsync(
            request.UserId, request.Page, request.PageSize, ct);

        return new PagedResult<NotificationDTO>
        {
            Items = notifications.Select(mapper.ToDTO).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }
}
