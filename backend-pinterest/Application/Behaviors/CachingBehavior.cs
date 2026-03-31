using Domain.Interfaces.Caching;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Application.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICacheableQuery
{
    private readonly IDistributedCache _cache;

    public CachingBehavior(IDistributedCache cache) => _cache = cache;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var cachedData = await _cache.GetStringAsync(request.CacheKey, ct);
        if (cachedData != null)
        {
            return JsonSerializer.Deserialize<TResponse>(cachedData)!;
        }

        var response = await next();

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = request.Expiration ?? TimeSpan.FromMinutes(5)
        };
        await _cache.SetStringAsync(request.CacheKey, JsonSerializer.Serialize(response), options, ct);

        return response;
    }
}