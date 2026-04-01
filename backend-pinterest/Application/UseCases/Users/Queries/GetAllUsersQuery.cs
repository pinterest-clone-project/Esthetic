using MediatR;
using Domain.Interfaces.Caching;
using Application.UseCases.Users.Response;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserResponse>>, ICacheableQuery
{
    public string CacheKey => "users:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
