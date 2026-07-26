namespace Application.Models.DTO.News;

public class NewsDTO
{
    public Guid Id { get; set; }
    public string TitleUk { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string ExcerptUk { get; set; } = string.Empty;
    public string ExcerptEn { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public string? Image { get; set; }
    public string? Content { get; set; }
    public DateTime PublishedAt { get; set; }
    public bool IsFeatured { get; set; }
}
