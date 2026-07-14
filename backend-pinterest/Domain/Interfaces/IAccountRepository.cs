using Domain.Entities.Identity;

namespace Domain.Interfaces;

public interface IAccountRepository : IBaseRepository<UserEntity>
{
    Task<UserEntity> EditAsync(UserEntity user, CancellationToken ct = default);
    Task<UserEntity?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> IsUserNameTakenAsync(string userName, Guid excludeUserId, CancellationToken ct = default);
}