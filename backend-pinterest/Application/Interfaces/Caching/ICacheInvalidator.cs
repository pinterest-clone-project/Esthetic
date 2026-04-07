namespace Application.Interfaces.Caching;

public interface ICacheInvalidator
{
    string CacheKey { get; }
}