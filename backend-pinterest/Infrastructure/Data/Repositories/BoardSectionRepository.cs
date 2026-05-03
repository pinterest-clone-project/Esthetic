using Domain.Entities.BoardSection;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class BoardSectionRepository : BaseRepository<BoardSectionEntity>, IBoardSectionRepository
{
    public BoardSectionRepository(AppDbContext db) : base(db) { }
}