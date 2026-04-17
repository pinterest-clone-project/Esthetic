using Application.Common.Sorting;
using Application.Common.Sorting.User;
using Application.Models.DTO;
using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Users.Queries;

public record SearchUsersQuery : IRequest<PagedResult<UserDTO>>
{
    public string? Search { get; init; }
    public bool? IsPrivate { get; init; }
    public bool? IsBlocked { get; init; }
    public UserSortBy SortBy { get; init; } = UserSortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Asc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}