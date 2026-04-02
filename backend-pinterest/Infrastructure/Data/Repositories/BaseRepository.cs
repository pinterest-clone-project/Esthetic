using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Domain.Entities.Base;

namespace Infrastructure.Data.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
{
    protected readonly AppDbContext _db;

    public BaseRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<T> AddAsync(T entity)
    {
        await _db.Set<T>().AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _db.Set<T>().FindAsync(id);
        if (entity == null)
            return;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _db.Set<T>().Update(entity);

        await _db.SaveChangesAsync();
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _db.Set<T>().Where(e => !e.IsDeleted).ToListAsync();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        var entity = await _db.Set<T>().FindAsync(id);
        if (entity == null)
            return null;

        if (entity.IsDeleted)
            return null;

        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        _db.Set<T>().Update(entity);
        await _db.SaveChangesAsync();
    }
}
