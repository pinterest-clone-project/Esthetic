using Application.Common.Sorting;
using Application.Common.Sorting.Category;
using Application.Models.DTO;
using Application.Models.DTO.Category;
using MediatR;

namespace Application.UseCases.Categories.Queries;

public record SearchCategoriesQuery : IRequest<PagedResult<CategoryDTO>>
{
    public string? Search { get; init; }
    public CategorySortBy SortBy { get; init; } = CategorySortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Asc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}