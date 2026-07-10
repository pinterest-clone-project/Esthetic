using Domain.Entities.Board;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class BoardPinRepository(AppDbContext db) : BaseRepository<BoardPinEntity>(db), IBoardPinRepository
{
    public async Task<BoardPinEntity?> GetByPinAndBoardAsync(Guid pinId, Guid boardId, CancellationToken ct = default)
        => await _db.Set<BoardPinEntity>()
            .Where(bp => bp.PinId == pinId && bp.BoardId == boardId && !bp.IsDeleted)
            .FirstOrDefaultAsync(ct);

    public async Task<BoardPinEntity?> GetByPinAndBoardIncludingDeletedAsync(Guid pinId, Guid boardId, CancellationToken ct = default)
        => await _db.Set<BoardPinEntity>()
            .Where(bp => bp.PinId == pinId && bp.BoardId == boardId)
            .FirstOrDefaultAsync(ct);

    public async Task<bool> ExistsAsync(Guid pinId, Guid boardId, CancellationToken ct = default)
        => await _db.Set<BoardPinEntity>()
            .AnyAsync(bp => bp.PinId == pinId && bp.BoardId == boardId && !bp.IsDeleted, ct);

    public async Task AddRangeAsync(IEnumerable<BoardPinEntity> entities, CancellationToken ct = default)
    {
        await _db.Set<BoardPinEntity>().AddRangeAsync(entities, ct);
        await _db.SaveChangesAsync(ct);
    }
}