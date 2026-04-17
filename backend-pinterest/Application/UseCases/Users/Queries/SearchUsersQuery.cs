using Application.Models.DTO;
using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Users.Queries;

public record SearchUsersQuery : IRequest<PagedResult<UserDTO>>
{
    public string? Search { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}