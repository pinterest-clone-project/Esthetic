using Domain.Entities.Comment;

namespace Domain.Interfaces;

public interface ICommentRepository : IBaseRepository<CommentEntity>
{
    Task<List<CommentEntity>> GetByPinIdAsync(Guid pinId, CancellationToken ct = default);
}
