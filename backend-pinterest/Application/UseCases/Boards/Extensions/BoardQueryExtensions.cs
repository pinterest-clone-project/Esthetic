using Application.Common.Sorting;
using Application.Common.Sorting.Board;
using Application.UseCases.Boards.Queries;
using Domain.Entities.Board;

namespace Application.UseCases.Boards.Extensions;

public static class BoardQueryExtensions
{
    public static IQueryable<BoardEntity> ApplyFilters(
        this IQueryable<BoardEntity> query,
        SearchBoardsQuery filter)
    {
        if (!filter.IncludeArchived)
        {
            query = query.Where(b => !b.IsArchived);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(b =>
                b.Title.ToLower().Contains(search) ||
                (b.Description != null && b.Description.ToLower().Contains(search)));
        }

        return query;
    }

    public static IQueryable<BoardEntity> ApplySorting(
        this IQueryable<BoardEntity> query,
        SearchBoardsQuery filter)
    {
        return (filter.SortBy, filter.SortDirection) switch
        {
            (BoardSortBy.Title, SortDirection.Asc) => query.OrderBy(b => b.Title),
            (BoardSortBy.Title, SortDirection.Desc) => query.OrderByDescending(b => b.Title),
            (BoardSortBy.PinsCount, SortDirection.Asc) => query.OrderBy(b => b.BoardPins.Count),
            (BoardSortBy.PinsCount, SortDirection.Desc) => query.OrderByDescending(b => b.BoardPins.Count),
            (BoardSortBy.CreatedAt, SortDirection.Asc) => query.OrderBy(b => b.CreatedAt),
            (BoardSortBy.CreatedAt, SortDirection.Desc) => query.OrderByDescending(b => b.CreatedAt),
            _ => query.OrderByDescending(b => b.CreatedAt)
        };
    }
}
