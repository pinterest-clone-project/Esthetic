namespace Domain.Interfaces;

public interface IBaseRepository<T> where T : class
{
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    IQueryable<T> GetQueryable();
}