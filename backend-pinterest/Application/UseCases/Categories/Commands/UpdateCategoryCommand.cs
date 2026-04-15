using Application.Interfaces.Caching;
using Application.Models.DTO.Category;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Categories.Commands;

public record UpdateCategoryCommand : IRequest<CategoryDTO>, ICacheInvalidator
{
    [BindNever]
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public string? Description { get; init; }

    [FromForm]
    public IFormFile? ImageFile { get; init; }
    [BindNever]
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllCategories,
    ];
}