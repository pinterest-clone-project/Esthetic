using Domain.Entities.Identity;
using Domain.Entities.Pins;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Like;

[Table("Likes")]
public class LikeEntity
{
    public Guid PinId { get; set; }
    public PinEntity Pin { get; set; } = null!;

    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}