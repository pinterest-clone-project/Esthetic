using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Pins;

[Table("PinTags")]
public class PinTagEntity
{
    public Guid PinId { get; set; }
    public PinEntity Pin { get; set; } = null!;

    public Guid TagId { get; set; }
    public TagEntity Tag { get; set; } = null!;
}