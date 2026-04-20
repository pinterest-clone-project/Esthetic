using Domain.Entities.Base;
using Domain.Entities.Pins;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Category;

[Table("Categories")]
public class CategoryEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public virtual ICollection<PinEntity>? Pins { get; set; }
}
