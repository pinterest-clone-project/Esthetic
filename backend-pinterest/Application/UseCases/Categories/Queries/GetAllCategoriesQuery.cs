using Application.Interfaces.Caching;
using Application.Models.DTO.Category;
using MediatR;

namespace Application.UseCases.Categories.Queries;

public record GetAllCategoriesQuery : IRequest<List<CategoryDTO>>, ICacheableQuery
{
    public string CacheKey => throw new NotImplementedException();

    public TimeSpan? Expiration => throw new NotImplementedException();
}
