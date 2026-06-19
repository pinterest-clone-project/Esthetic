using Application.Interfaces.Notifiers;
using Application.Models.DTO.Notification;
using backend_pinterest.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend_pinterest.Middleware;

public class SignalRNotificationNotifier(IHubContext<ChatHub> hubContext) : INotificationNotifier
{
    public Task NotifyAsync(Guid userId, NotificationDTO notification) =>
        hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", notification);
}