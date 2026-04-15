namespace Application.Interfaces.Caching;

public interface ICacheInvalidator
{
    IReadOnlyList<string> CacheKeysInvalidators { get; }
}