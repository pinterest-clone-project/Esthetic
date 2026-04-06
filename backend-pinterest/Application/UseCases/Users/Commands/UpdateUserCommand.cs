using Application.Interfaces.Caching;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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
