using Application.UseCases.Notifications.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Notifications.Handlers;

public class MarkNotificationAsReadCommandHandler(INotificationRepository repository)
    : IRequestHandler<MarkNotificationAsReadCommand>
{
    public Task Handle(MarkNotificationAsReadCommand request, CancellationToken ct) =>
        repository.MarkAsReadAsync(request.NotificationId, ct);
}