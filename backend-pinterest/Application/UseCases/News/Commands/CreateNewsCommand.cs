using Application.Models.DTO.News;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.News.Commands;

public record CreateNewsCommand : IRequest<NewsDTO>
{
    public required string TitleUk { get; init; }
    public required string TitleEn { get; init; }
    public required string ExcerptUk { get; init; }
    public required string ExcerptEn { get; init; }
    public required string Tag { get; init; }
    [FromForm] public IFormFile? ImageFile { get; init; }
    public string? Content { get; init; }
    public DateTime PublishedAt { get; init; }
    public bool IsFeatured { get; init; }
}
