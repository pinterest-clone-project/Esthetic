using Application.Interfaces.Caching;
using Application.Models.DTO.Category;
using Domain.Constants;
using MediatR;

namespace Application.UseCases.Categories.Queries;

public record GetAllCategoriesQuery : IRequest<List<CategoryDTO>>, ICacheableQuery
{
    public string CacheKey => CacheKeys.AllCategories;

    public TimeSpan? Expiration => AppTimeToLive.ListCacheExpiration;
}
