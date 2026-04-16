
using Application.Interfaces.Caching;
using Domain.Constants;
using MediatR;

namespace Application.UseCases.Tags.Commands;

public record DeleteTagCommand(Guid id) : IRequest<Unit>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllTags,
    ];
}
