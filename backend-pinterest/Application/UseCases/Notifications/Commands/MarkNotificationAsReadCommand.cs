using MediatR;

namespace Application.UseCases.Notifications.Commands;

public record MarkNotificationAsReadCommand(Guid NotificationId) : IRequest;