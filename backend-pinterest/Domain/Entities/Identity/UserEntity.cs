using Domain.Entities.Base;
using Domain.Entities.Follow;
using Domain.Entities.Like;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

public class UserEntity : IdentityUser<Guid>, IEntity
{
    public string? FirstName { get; set; } = null;
    public string? LastName { get; set; } = null;
    public string? Bio { get; set; } = null;
    public string? Image { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
    public bool IsPrivate { get; set; } = false;
    public bool IsBlocked { get; set; } = false;
    public string? BlockReason { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
    public virtual ICollection<UserLoginEntity>? UserLogins { get; set; }
    public virtual ICollection<FollowEntity>? Following { get; set; }
    public virtual ICollection<FollowEntity>? Followers { get; set; }
    public virtual ICollection<LikeEntity>? Likes { get; set; }
}
