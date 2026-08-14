using Domain.Entities.Comment;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class CommentReactionRepository(AppDbContext db) : ICommentReactionRepository
{
    public async Task<List<CommentReactionEntity>> ToggleAsync(Guid commentId, Guid userId, string emoji, CancellationToken ct = default)
    {
        var existing = await db.CommentReactions
            .FirstOrDefaultAsync(r => r.CommentId == commentId && r.UserId == userId, ct);

        if (existing is not null)
        {
            if (existing.Emoji == emoji)
                db.CommentReactions.Remove(existing);
            else
                existing.Emoji = emoji;
        }
        else
        {
            db.CommentReactions.Add(new CommentReactionEntity
            {
                CommentId = commentId,
                UserId = userId,
                Emoji = emoji
            });
        }

        await db.SaveChangesAsync(ct);

        return await db.CommentReactions
            .Where(r => r.CommentId == commentId)
            .ToListAsync(ct);
    }

    public async Task<List<CommentReactionEntity>> GetByCommentIdAsync(Guid commentId, CancellationToken ct = default) =>
        await db.CommentReactions.Where(r => r.CommentId == commentId).ToListAsync(ct);

    public async Task<List<CommentReactionEntity>> GetByCommentIdsAsync(IEnumerable<Guid> commentIds, CancellationToken ct = default) =>
        await db.CommentReactions.Where(r => commentIds.Contains(r.CommentId)).ToListAsync(ct);
}
