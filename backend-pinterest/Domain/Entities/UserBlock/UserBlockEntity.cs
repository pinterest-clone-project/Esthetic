using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.UserBlock;

[Table("UserBlocks")]
public class UserBlockEntity
{
    public Guid BlockerId { get; set; }
    public UserEntity Blocker { get; set; } = null!;

    public Guid BlockedId { get; set; }
    public UserEntity Blocked { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}