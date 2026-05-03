using Domain.Entities.Board;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class BoardPinRepository : BaseRepository<BoardPinEntity>, IBoardPinRepository
{
    public BoardPinRepository(AppDbContext db) : base(db) { }
}
