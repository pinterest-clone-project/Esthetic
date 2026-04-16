
using Application.Interfaces.Caching;
using Application.Models.DTO.Tag;
using Domain.Constants;
using MediatR;

namespace Application.UseCases.Tags.Queries;

public record GetAllTagsQuery() : IRequest<List<TagDTO>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllTags;
    public TimeSpan? Expiration => AppTimeToLive.ListCacheExpiration;
}

