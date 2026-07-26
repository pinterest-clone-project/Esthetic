using Domain.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.News;

[Table("News")]
public class NewsEntity : BaseEntity
{
    public string TitleUk { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string ExcerptUk { get; set; } = string.Empty;
    public string ExcerptEn { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public string? Image { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public bool IsFeatured { get; set; }
}
