using Application.Common.Sorting;
using Application.Common.Sorting.Tag;
using Application.Models.DTO;
using Application.Models.DTO.Tag;
using MediatR;

namespace Application.UseCases.Tags.Queries;

public record SearchTagsQuery : IRequest<PagedResult<TagDTO>>
{
    public string? Search { get; init; }
    public TagSortBy SortBy { get; init; } = TagSortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Asc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}