using Application.Common.Sorting;
using Application.Common.Sorting.Board;
using Application.Models.DTO;
using Application.Models.DTO.Board;
using MediatR;

namespace Application.UseCases.Boards.Queries;

public record SearchBoardsQuery : IRequest<PagedResult<BoardDTO>>
{
    public string? Search { get; init; }
    public BoardSortBy SortBy { get; init; } = BoardSortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Desc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public bool IncludeArchived { get; init; } = false;
}
