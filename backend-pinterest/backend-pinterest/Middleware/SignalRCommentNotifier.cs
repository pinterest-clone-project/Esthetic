using Application.Interfaces.Notifiers;
using Application.Models.DTO.Chat;
using Application.Models.DTO.Comment;
using backend_pinterest.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend_pinterest.Middleware;

public class SignalRCommentNotifier(IHubContext<CommentHub> hubContext) : ICommentNotifier
{
    public Task NotifyCreatedAsync(Guid pinId, CommentResponseDTO comment) =>
        hubContext.Clients.Group($"pin_{pinId}").SendAsync("CommentCreated", comment);

    public Task NotifyUpdatedAsync(Guid pinId, CommentResponseDTO comment) =>
        hubContext.Clients.Group($"pin_{pinId}").SendAsync("CommentUpdated", comment);

    public Task NotifyDeletedAsync(Guid pinId, Guid commentId) =>
        hubContext.Clients.Group($"pin_{pinId}").SendAsync("CommentDeleted", commentId);

    public Task NotifyReactionUpdatedAsync(Guid pinId, Guid commentId, IEnumerable<ReactionGroupDTO> reactions) =>
        hubContext.Clients.Group($"pin_{pinId}").SendAsync("CommentReactionUpdated", new { commentId, reactions });
}
