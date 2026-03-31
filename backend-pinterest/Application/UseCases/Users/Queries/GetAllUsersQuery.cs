using Application.UseCases.Users.Dto;
using MediatR;
using Domain.Interfaces.Caching;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDto>>, ICacheableQuery
{
    public string CacheKey => "users:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
