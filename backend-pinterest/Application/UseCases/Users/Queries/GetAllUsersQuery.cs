using MediatR;
using Domain.Interfaces.Caching;
using Application.UseCases.Users.Responses;
using Domain.Constants;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserResponse>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllUsers;
    public TimeSpan? Expiration => AppTimeToLive.UserCacheExpiration;
}
