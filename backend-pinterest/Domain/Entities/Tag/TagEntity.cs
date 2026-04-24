using Domain.Entities.Base;
using Domain.Entities.PinTag;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Tag;

[Table("Tags")]
public class TagEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<PinTagEntity>? PinTags { get; set; }
}
