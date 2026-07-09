using Application.Common.Sorting;
using Application.Common.Sorting.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Entities.Pin;

namespace Application.UseCases.Pins.Extensions;

public static class PinQueryExtensions
{
    public static IQueryable<PinEntity> ApplyFilters(
        this IQueryable<PinEntity> query,
        SearchPinsQuery filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(p =>
                (p.Title != null && p.Title.ToLower().Contains(search)) ||
                (p.Description != null && p.Description.ToLower().Contains(search)) ||
                (p.SourceUrl != null && p.SourceUrl.ToLower().Contains(search)) ||
                (p.Category != null && p.Category.Name.ToLower().Contains(search)) ||
                (p.PinTags != null && p.PinTags.Any(pt => pt.Tag.Name.ToLower().Contains(search))));
        }

        return query;
    }

    public static IQueryable<PinEntity> ApplySorting(
        this IQueryable<PinEntity> query,
        SearchPinsQuery filter)
    {
        return (filter.SortBy, filter.SortDirection) switch
        {
            (PinSortBy.Title, SortDirection.Asc) => query.OrderBy(p => p.Title),
            (PinSortBy.Title, SortDirection.Desc) => query.OrderByDescending(p => p.Title),
            (PinSortBy.LikesCount, SortDirection.Asc) => query.OrderBy(p => p.Likes!.Count),
            (PinSortBy.LikesCount, SortDirection.Desc) => query.OrderByDescending(p => p.Likes!.Count),
            (PinSortBy.CommentsCount, SortDirection.Asc) => query.OrderBy(p => p.Comments!.Count),
            (PinSortBy.CommentsCount, SortDirection.Desc) => query.OrderByDescending(p => p.Comments!.Count),
            (PinSortBy.CreatedAt, SortDirection.Asc) => query.OrderBy(p => p.CreatedAt),
            (PinSortBy.CreatedAt, SortDirection.Desc) => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };
    }
}
