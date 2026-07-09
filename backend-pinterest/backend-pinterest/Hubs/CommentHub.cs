using Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace backend_pinterest.Hubs;

[Authorize]
public class CommentHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirstValue(JwtClaims.Id);
        if (!string.IsNullOrEmpty(userId))
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirstValue(JwtClaims.Id);
        if (!string.IsNullOrEmpty(userId))
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinPinGroup(Guid pinId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"pin_{pinId}");
    }

    public async Task LeavePinGroup(Guid pinId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"pin_{pinId}");
    }
}
