using Domain.Constants;
using Domain.Interfaces.Caching;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Serialization;

namespace Application.UseCases.Users.Commands;

public record UpdateUserCommand : IRequest<Unit>, ICacheInvalidator
{
    [BindNever]
    public Guid Id { get; init; }

    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }

    [BindNever]
    public string CacheKey => CacheKeys.AllUsers;
}
