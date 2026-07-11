using Domain.Entities.Board;
using Domain.Entities.Pin;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;
public class PinRepository(AppDbContext db) : BaseRepository<PinEntity>(db), IPinRepository
{
    public async Task<PinEntity?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
        => await _db.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Category)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.Creator)  // add this
            .Where(p => !p.IsDeleted && p.Id == id)
            .FirstOrDefaultAsync(ct);

    public async Task<List<PinEntity>> GetAllWithDetailsAsync(CancellationToken ct = default)
        => await _db.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Category)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Where(p => !p.IsDeleted)
            .ToListAsync(ct);

    public async Task<List<Guid>> GetTagIdsByPinIdsAsync(List<Guid> pinIds,CancellationToken ct = default)
    =>
         await _db.PinTags
            .Where(pt => pinIds.Contains(pt.PinId))
            .Select(pt => pt.TagId)
            .Distinct()
            .ToListAsync(ct);
    public async Task<List<PinEntity>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _db.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Likes)
            .Include(p => p.Category)
            .Where(p => p.CreatorId == userId && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

    public async Task<List<PinEntity>> GetSavedByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        var savedPinIds = await _db.Set<BoardPinEntity>()
            .Where(bp => bp.Board.OwnerId == userId && !bp.IsDeleted)
            .Select(bp => bp.PinId)
            .Distinct()
            .ToListAsync(ct);

        return await _db.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Likes)
            .Include(p => p.Category)
            .Where(p => savedPinIds.Contains(p.Id) && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }
}
