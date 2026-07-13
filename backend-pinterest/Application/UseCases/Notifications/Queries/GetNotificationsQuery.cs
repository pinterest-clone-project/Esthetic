using Application.Models.DTO;
using Application.Models.DTO.Notification;
using MediatR;

namespace Application.UseCases.Notifications.Queries;

public record GetNotificationsQuery(Guid UserId, int Page = 1, int PageSize = 5) : IRequest<PagedResult<NotificationDTO>>;