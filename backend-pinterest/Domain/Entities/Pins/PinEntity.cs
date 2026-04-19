using Domain.Entities.Base;
using Domain.Entities.Category;
using Domain.Entities.Identity;
using Domain.Entities.PinTag;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Pins;

[Table("Pins")]
public class PinEntity : BaseEntity
{
    public Guid CreatorId { get; set; }
    public UserEntity Creator { get; set; } = null!;
    public string? Title { get; set; } = null;
    public string? Description { get; set; } = null;
    public string? MediaUrl { get; set; } = null;
    public string? SourceUrl { get; set; } = null;
    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
    public Guid? CategoryId { get; set; }
    public CategoryEntity? Category { get; set; }
}
