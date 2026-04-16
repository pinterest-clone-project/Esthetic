
using Application.Interfaces.Caching;
using Application.Models.DTO.Tag;
using Domain.Constants;
using MediatR;

namespace Application.UseCases.Tags.Commands;

public record CreateTagCommand() : IRequest<TagDTO>, ICacheInvalidator
{
    public required string Name { get; init; }
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllTags,
    ];
}
