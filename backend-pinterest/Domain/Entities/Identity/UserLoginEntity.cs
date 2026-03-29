using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

public class UserLoginEntity : IdentityUserLogin<Guid>
{
    public UserEntity User { get; set; }
}
