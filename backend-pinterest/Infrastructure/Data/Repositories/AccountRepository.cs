using Domain.Entities.Identity;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class AccountRepository : BaseRepository<UserEntity>, IAccountRepository
{
    public AccountRepository(AppDbContext db) : base(db)
    {
    }
    public async Task<UserEntity> EditAsync(UserEntity user, CancellationToken ct = default)
    {
        await UpdateAsync(user, ct);
        return user;
    }

    public async Task<UserEntity?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _db.Users
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted, ct);
    }

    public async Task<bool> IsUserNameTakenAsync(string userName, Guid excludeUserId, CancellationToken ct = default)
    {
        return await _db.Users
            .AnyAsync(u => u.UserName == userName && u.Id != excludeUserId && !u.IsDeleted, ct);
    }
}
