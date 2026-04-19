using Domain.Entities.Identity;
using Domain.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Pins;

[Table("Pins")]
public class PinEntity : BaseEntity
{
    public Guid CreatorId { get; set; }
    public UserEntity Creator { get; set; } = null!;
    public string? Title { get; set; } = null;
    public string? Description { get; set; } = null;
    public string? Media_Url { get; set; } = null;
    public string? Source_Url { get; set; } = null;
    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
}
