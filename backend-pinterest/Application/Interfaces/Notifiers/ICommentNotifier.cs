using Application.Models.DTO.Comment;

namespace Application.Interfaces.Notifiers;

public interface ICommentNotifier
{
    Task NotifyCreatedAsync(Guid pinId, CommentResponseDTO comment);
    Task NotifyUpdatedAsync(Guid pinId, CommentResponseDTO comment);
    Task NotifyDeletedAsync(Guid pinId, Guid commentId);
}
