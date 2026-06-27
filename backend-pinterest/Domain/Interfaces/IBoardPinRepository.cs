using Domain.Entities.Board;

namespace Domain.Interfaces;
public interface IBoardPinRepository : IBaseRepository<BoardPinEntity>
{
    Task<BoardPinEntity?> GetByPinAndBoardAsync(Guid pinId, Guid boardId, CancellationToken ct = default);
    Task<bool> ExistsAsync(Guid pinId, Guid boardId, CancellationToken ct = default);
}
