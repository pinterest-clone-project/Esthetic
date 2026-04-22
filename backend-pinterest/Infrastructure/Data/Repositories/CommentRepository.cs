using Domain.Entities.Comment;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class CommentRepository : BaseRepository<CommentEntity>, ICommentRepository
{
    public CommentRepository(AppDbContext db): base(db) { }
    public async Task<List<CommentEntity>> GetByPinIdAsync(Guid pinId, CancellationToken ct = default)
    {
        return await _db.Comments
            .Where(c => c.PinId == pinId && !c.IsDeleted)
            .Include(c => c.User)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(ct);
    }
}