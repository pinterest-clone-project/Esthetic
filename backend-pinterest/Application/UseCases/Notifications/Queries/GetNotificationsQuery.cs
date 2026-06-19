using Application.Models.DTO.Notification;
using MediatR;

namespace Application.UseCases.Notifications.Queries;

public record GetNotificationsQuery(Guid UserId) : IRequest<List<NotificationDTO>>;