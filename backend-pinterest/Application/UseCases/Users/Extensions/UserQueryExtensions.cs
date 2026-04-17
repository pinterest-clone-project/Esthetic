using Application.Common.Sorting;
using Application.Common.Sorting.User;
using Application.UseCases.Users.Queries;
using Domain.Entities.Identity;

namespace Application.UseCases.Users.Extensions;

public static class UserQueryExtensions
{
    public static IQueryable<UserEntity> ApplyFilters(
        this IQueryable<UserEntity> query, SearchUsersQuery filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(u =>
                (u.UserName != null && u.UserName.ToLower().Contains(search)) ||
                (u.FirstName != null && u.FirstName.ToLower().Contains(search)) ||
                (u.LastName != null && u.LastName.ToLower().Contains(search)));
        }

        if (filter.IsPrivate.HasValue)
            query = query.Where(u => u.IsPrivate == filter.IsPrivate.Value);

        if (filter.IsBlocked.HasValue)
            query = query.Where(u => u.IsBlocked == filter.IsBlocked.Value);

        return query;
    }

    public static IQueryable<UserEntity> ApplySorting(
        this IQueryable<UserEntity> query, SearchUsersQuery filter)
    {
        return (filter.SortBy, filter.SortDirection) switch
        {
            (UserSortBy.CreatedAt, SortDirection.Asc) => query.OrderBy(u => u.CreatedAt),
            (UserSortBy.CreatedAt, SortDirection.Desc) => query.OrderByDescending(u => u.CreatedAt),
            (UserSortBy.UserName, SortDirection.Asc) => query.OrderBy(u => u.UserName),
            (UserSortBy.UserName, SortDirection.Desc) => query.OrderByDescending(u => u.UserName),
            _ => query.OrderBy(u => u.CreatedAt)
        };
    }
}