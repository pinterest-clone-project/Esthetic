using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Follow;

[Table("Follows")]
public class FollowEntity
{
    public Guid FollowerId { get; set; }
    public UserEntity Follower { get; set; } = null!;
    public Guid FolloweeId { get; set; }
    public UserEntity Followee { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}