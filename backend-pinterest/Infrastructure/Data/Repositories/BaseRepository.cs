using Domain.Entities.Base;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
{
    protected readonly AppDbContext _db;

    public BaseRepository(AppDbContext db)
    {
        _db = db;
    }
    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await _db.Set<T>().AddAsync(entity, ct);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _db.Set<T>().FindAsync([id], ct);
        if (entity == null) return;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _db.Set<T>().Update(entity);

        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<T>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Set<T>().Where(e => !e.IsDeleted).ToListAsync(ct);
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _db.Set<T>().FindAsync([id], ct);
        if (entity == null || entity.IsDeleted) return null;
        return entity;
    }

    public IQueryable<T> GetQueryable() =>
        _db.Set<T>()
            .Where(e => !e.IsDeleted)
            .AsNoTracking()
            .AsQueryable();

    public async Task UpdateAsync(T entity, CancellationToken ct = default)
    {
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _db.Set<T>().Update(entity);
        await _db.SaveChangesAsync(ct);
    }
}
