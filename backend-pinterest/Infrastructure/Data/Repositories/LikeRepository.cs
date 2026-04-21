using Domain.Entities.Like;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class LikeRepository(AppDbContext context) : ILikeRepository
{
    public Task LikeAsync(Guid userId, Guid pinId, CancellationToken ct = default)
    {
        throw new NotImplementedException();
    }

    public Task UnlikeAsync(Guid userId, Guid pinId, CancellationToken ct = default)
    {
        throw new NotImplementedException();
    }
}