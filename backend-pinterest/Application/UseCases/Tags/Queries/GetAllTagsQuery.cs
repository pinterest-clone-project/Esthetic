
using Application.Models.DTO.Tag;
using Application.Models.DTO.User;
using Domain.Constants;
using Domain.Interfaces.Caching;
using MediatR;

namespace Application.UseCases.Tags.Queries;

public record GetAllTagsQuery() : IRequest<List<TagDTO>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllTags;
    public TimeSpan? Expiration => AppTimeToLive.UserCacheExpiration;
}

