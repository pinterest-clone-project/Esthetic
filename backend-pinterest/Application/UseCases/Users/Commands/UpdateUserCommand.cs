using Domain.Interfaces.Caching;
using MediatR;
using System.Text.Json.Serialization;

namespace Application.UseCases.Users.Commands;

public record UpdateUserCommand : IRequest<Unit>, ICacheInvalidator
{
    [JsonIgnore]
    public Guid Id { get; init; }

    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }

    [JsonIgnore]
    public string CacheKey => "users:all";
}
