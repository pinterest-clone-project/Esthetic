using Domain.Entities.Base;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class BaseRepository<T>(AppDbContext appDbContext) : IBaseRepository<T> where T : class, IEntity
{
    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await appDbContext.Set<T>().AddAsync(entity, ct);
        await appDbContext.SaveChangesAsync(ct);
        return entity;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await appDbContext.Set<T>().FindAsync([id], ct);
        if (entity == null) return;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        appDbContext.Set<T>().Update(entity);

        await appDbContext.SaveChangesAsync(ct);
    }

    public async Task<List<T>> GetAllAsync(CancellationToken ct = default)
    {
        return await appDbContext.Set<T>().Where(e => !e.IsDeleted).ToListAsync(ct);
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await appDbContext.Set<T>().FindAsync([id], ct);
        if (entity == null || entity.IsDeleted) return null;
        return entity;
    }

    public async Task UpdateAsync(T entity, CancellationToken ct = default)
    {
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        appDbContext.Set<T>().Update(entity);
        await appDbContext.SaveChangesAsync(ct);
    }
}
