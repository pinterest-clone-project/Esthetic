using Application.UseCases.Notifications.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class MarkNotificationsAsReadHandler(INotificationRepository repository)
    : IRequestHandler<MarkNotificationsAsReadCommand>
{
    public Task Handle(MarkNotificationsAsReadCommand request, CancellationToken ct) =>
        repository.MarkAllAsReadAsync(request.UserId, ct);
}
