using Domain.Entities.Comment;

namespace Domain.Interfaces;

public interface ICommentReactionRepository
{
    Task<List<CommentReactionEntity>> ToggleAsync(Guid commentId, Guid userId, string emoji, CancellationToken ct = default);
    Task<List<CommentReactionEntity>> GetByCommentIdAsync(Guid commentId, CancellationToken ct = default);
    Task<List<CommentReactionEntity>> GetByCommentIdsAsync(IEnumerable<Guid> commentIds, CancellationToken ct = default);
}
