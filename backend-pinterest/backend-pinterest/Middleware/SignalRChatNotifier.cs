using Application.Interfaces.Notifiers;
using Application.Models.DTO.Chat;
using backend_pinterest.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend_pinterest.Middleware;

public class SignalRChatNotifier(IHubContext<ChatHub> hubContext) : IChatNotifier
{
    public Task NotifyNewMessageAsync(Guid receiverId, MessageDTO message) =>
        hubContext.Clients.Group(receiverId.ToString()).SendAsync("ReceiveMessage", message);
    public Task NotifyNewChatAsync(Guid receiverId, ChatDTO chat) =>
        hubContext.Clients.Group(receiverId.ToString()).SendAsync("ReceiveNewChat", chat);
}
