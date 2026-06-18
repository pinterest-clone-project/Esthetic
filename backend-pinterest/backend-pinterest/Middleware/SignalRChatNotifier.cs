using Application.Interfaces;
using Application.Models.DTO.Chat;
using backend_pinterest.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend_pinterest.Middleware;

public class SignalRChatNotifier(IHubContext<ChatHub> hubContext) : IChatNotifier
{
    public Task NotifyNewMessageAsync(Guid receiverId, MessageDTO message) =>
        hubContext.Clients.Group(receiverId.ToString()).SendAsync("ReceiveMessage", message);
}
