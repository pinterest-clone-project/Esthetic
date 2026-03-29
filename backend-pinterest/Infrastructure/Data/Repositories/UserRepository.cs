using Domain.Entities.Identity;
using Domain.Interfaces;

namespace Infrastructure.Data.Repositories;

public class UserRepository : BaseRepository<UserEntity>, IUserRepository
{
    public UserRepository(AppDbContext db) : base(db)
    {
    }
}
