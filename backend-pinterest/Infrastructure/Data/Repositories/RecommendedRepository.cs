
using Domain.Entities.Recommended;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class RecommendedRepository : IRecommendedRepository
{
    
    protected readonly AppDbContext _db;

    public RecommendedRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(UserPinInteraction entity, CancellationToken ct = default)
    {
        await _db.AddAsync(entity, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<UserPinInteraction>> GetAllByUserAsync(Guid UserId,CancellationToken ct = default)
    {
        return await _db.UserPinInteractions.Where(x => x.UserId == UserId).ToListAsync();
    }

    public async Task<UserPinInteraction> GetByUserPerPinAsync(Guid UserId, Guid PinId, CancellationToken ct = default)
    {
        return await _db.UserPinInteractions.Where(x => x.UserId == UserId && x.PinId == PinId).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(UserPinInteraction entity, CancellationToken ct = default)
    {
        _db.Update(entity);
        await _db.SaveChangesAsync(ct);
    }
}
