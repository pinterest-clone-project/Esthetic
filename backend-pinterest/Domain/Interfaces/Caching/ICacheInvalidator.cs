namespace Domain.Interfaces.Caching;

public interface ICacheInvalidator
{
    string CacheKey { get; }
}