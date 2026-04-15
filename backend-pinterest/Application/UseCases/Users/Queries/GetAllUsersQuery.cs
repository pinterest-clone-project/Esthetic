using Application.Interfaces.Caching;
using Application.Models.DTO.User;
using Domain.Constants;
using MediatR;

namespace Application.UseCases.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDTO>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllTags;
    public TimeSpan? Expiration => AppTimeToLive.ListCacheExpiration;
}
