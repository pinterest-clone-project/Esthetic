

using Domain.Entities.Base;
using Domain.Entities.Pins;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("Tags")]
public class TagEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
}
