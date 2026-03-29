using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

public class UserRoleEntity : IdentityUserRole<Guid>
{
    public virtual UserEntity? User { get; set; }
    public virtual RoleEntity Role { get; set; }
}
