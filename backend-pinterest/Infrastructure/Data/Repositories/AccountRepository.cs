using Domain.Entities.Identity;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class AccountRepository : BaseRepository<UserEntity>, IAccountRepository
{
    public AccountRepository(AppDbContext db) : base(db)
    {
    }
}
