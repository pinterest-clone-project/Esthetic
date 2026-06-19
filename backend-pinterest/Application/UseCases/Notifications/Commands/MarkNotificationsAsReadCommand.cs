using MediatR;

namespace Application.UseCases.Notifications.Commands;

public record MarkNotificationsAsReadCommand(Guid UserId) : IRequest;
