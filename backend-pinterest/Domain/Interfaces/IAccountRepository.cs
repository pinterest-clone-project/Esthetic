using Domain.Entities.Identity;

namespace Domain.Interfaces;

public interface IAccountRepository : IBaseRepository<UserEntity>
{
}
