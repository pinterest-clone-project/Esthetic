using Domain.Entities.Identity;
using Domain.Entities.Pin;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Recommended;

[Table("users_pins_interactions")]
public class UserPinInteraction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; } 
    public UserEntity User { get; set; } = null!;
    public Guid PinId { get; set; }
    public PinEntity Pin { get; set; } = null!;

    public int ViewCount { get; set; } = 0;

    public DateTime LastViewedAt { get; set; } = DateTime.UtcNow;
}
