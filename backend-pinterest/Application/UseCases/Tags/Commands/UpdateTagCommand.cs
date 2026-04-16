
using Application.Interfaces.Caching;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Tags.Commands;

public record UpdateTagCommand : IRequest<Unit>, ICacheInvalidator
{
    [BindNever]
    public Guid Id { get; init; }
    public string? Name { get; init; }

    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllTags,
    ];
}
