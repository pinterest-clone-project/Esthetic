using Application.Common.Sorting;
using Application.Common.Sorting.Category;
using Application.UseCases.Categories.Queries;
using Domain.Entities.Category;

namespace Application.UseCases.Categories.Extensions;

public static class CategoryQueryExtensions
{
    public static IQueryable<CategoryEntity> ApplyFilters(
        this IQueryable<CategoryEntity> query, SearchCategoriesQuery filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(c =>
                c.Name.ToLower().Contains(search) ||
                c.Slug.ToLower().Contains(search));
        }

        return query;
    }

    public static IQueryable<CategoryEntity> ApplySorting(
        this IQueryable<CategoryEntity> query, SearchCategoriesQuery filter)
    {
        return (filter.SortBy, filter.SortDirection) switch
        {
            (CategorySortBy.Name, SortDirection.Asc) => query.OrderBy(c => c.Name),
            (CategorySortBy.Name, SortDirection.Desc) => query.OrderByDescending(c => c.Name),
            (CategorySortBy.CreatedAt, SortDirection.Asc) => query.OrderBy(c => c.CreatedAt),
            (CategorySortBy.CreatedAt, SortDirection.Desc) => query.OrderByDescending(c => c.CreatedAt),
            (CategorySortBy.PinsCount, SortDirection.Asc) => query.OrderBy(c => c.Pins!.Count),
            (CategorySortBy.PinsCount, SortDirection.Desc) => query.OrderByDescending(c => c.Pins!.Count),
            _ => query.OrderBy(c => c.CreatedAt)
        };
    }
}