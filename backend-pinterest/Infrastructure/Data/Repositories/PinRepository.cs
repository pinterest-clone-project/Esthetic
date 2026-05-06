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
}
