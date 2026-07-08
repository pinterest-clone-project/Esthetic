using Application.Common.Sorting;
using Application.Common.Sorting.Tag;
using Application.UseCases.Tags.Queries;
using Domain.Entities.Tag;

namespace Application.UseCases.Tags.Extensions;

public static class TagQueryExtensions
{
    public static IQueryable<TagEntity> ApplyFilters(
        this IQueryable<TagEntity> query, SearchTagsQuery filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(t => t.Name.ToLower().Contains(search));
        }

        return query;
    }

    public static IQueryable<TagEntity> ApplySorting(
        this IQueryable<TagEntity> query, SearchTagsQuery filter)
    {
        return (filter.SortBy, filter.SortDirection) switch
        {
            (TagSortBy.Name, SortDirection.Asc) => query.OrderBy(t => t.Name),
            (TagSortBy.Name, SortDirection.Desc) => query.OrderByDescending(t => t.Name),
            (TagSortBy.CreatedAt, SortDirection.Asc) => query.OrderBy(t => t.CreatedAt),
            (TagSortBy.CreatedAt, SortDirection.Desc) => query.OrderByDescending(t => t.CreatedAt),
            (TagSortBy.PinsCount, SortDirection.Asc) => query.OrderBy(t => t.PinTags!.Count),
            (TagSortBy.PinsCount, SortDirection.Desc) => query.OrderByDescending(t => t.PinTags!.Count),
            _ => query.OrderBy(t => t.CreatedAt)
        };
    }
}