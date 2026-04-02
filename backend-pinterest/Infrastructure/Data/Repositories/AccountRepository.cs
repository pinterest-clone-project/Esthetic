using Domain.Entities.Identity;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class AccountRepository : BaseRepository<UserEntity>, IAccountRepository
{
    public AccountRepository(AppDbContext db) : base(db)
    {
    }
    public async Task<UserEntity> EditAsync(UserEntity user)
    {
        await UpdateAsync(user);
        return user;
    }
}
