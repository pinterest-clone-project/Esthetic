namespace Domain.Interfaces;

public interface ILikeRepository
{
    Task LikeAsync(Guid userId, Guid pinId, CancellationToken ct = default);
    Task UnlikeAsync(Guid userId, Guid pinId, CancellationToken ct = default);
}
