using Domain.Entities.Pin;

namespace Domain.Interfaces;

public interface IPinRepository : IBaseRepository<PinEntity>
{
    Task<PinEntity?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<List<PinEntity>> GetAllWithDetailsAsync(CancellationToken ct = default);
}
