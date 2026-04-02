using Domain.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Identity;

[Table("RefreshTokens")]
public class RefreshTokenEntity : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public DateTime ExpiresAt { get; set; }
}
