using Application.Models.DTO.Category;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.UseCases.Categories.Commands;

public record CreateCategoryCommand : IRequest<CategoryDTO>
{
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public string? Description { get; init; }

    [FromForm]
    public IFormFile? ImageFile { get; init; }
}
