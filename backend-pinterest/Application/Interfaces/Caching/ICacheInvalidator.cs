namespace Application.Interfaces.Caching;

public interface ICacheInvalidator
{
    IReadOnlyList<string> CacheKeys { get; }
}