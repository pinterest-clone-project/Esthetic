using Application.Common.Sorting;
using Application.Common.Sorting.Pin;
using Application.Models.DTO;
using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record SearchPinsQuery : IRequest<PagedResult<PinSummaryDTO>>
{
    public string? Search { get; init; }
    public Guid? CategoryId { get; init; }
    public List<Guid>? TagIds { get; init; }
    public PinSortBy SortBy { get; init; } = PinSortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Desc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public Guid CurrentUserId { get; init; }
    public bool OnlyDeletedByAdmin { get; init; } = false;
}
