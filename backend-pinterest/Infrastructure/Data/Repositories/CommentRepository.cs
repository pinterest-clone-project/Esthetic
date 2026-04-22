using Domain.Entities.Comment;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class CommentRepository : BaseRepository<CommentEntity>, ICommentRepository
{
    public CommentRepository(AppDbContext db): base(db) { }
}