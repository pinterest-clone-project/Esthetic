using Application.Interfaces.Caching;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace Application.Behaviors;

public class CacheInvalidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICacheInvalidator
{
    private readonly IDistributedCache _cache;

    public CacheInvalidationBehavior(IDistributedCache cache) => _cache = cache;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var response = await next();
        await _cache.RemoveAsync(request.CacheKey, ct);
        return response;
    }
}