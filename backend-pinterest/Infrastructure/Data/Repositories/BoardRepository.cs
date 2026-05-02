using Domain.Entities.Board;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class BoardRepository : BaseRepository<BoardEntity>, IBoardRepository
{
    public BoardRepository(AppDbContext db) : base(db) { }
}

