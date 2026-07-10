using Domain.Entities.Pin;

namespace Domain.Interfaces;

public interface IPinRepository : IBaseRepository<PinEntity>
{
    Task<PinEntity?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<List<PinEntity>> GetAllWithDetailsAsync(CancellationToken ct = default);
    Task<List<Guid>> GetTagIdsByPinIdsAsync(List<Guid> pinIds, CancellationToken ct = default);
    Task<List<PinEntity>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
}
