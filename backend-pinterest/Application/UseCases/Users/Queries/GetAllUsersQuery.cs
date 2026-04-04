using MediatR;
using Domain.Interfaces.Caching;
using Domain.Constants;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDTO>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllTags;
    public TimeSpan? Expiration => AppTimeToLive.UserCacheExpiration;
}
