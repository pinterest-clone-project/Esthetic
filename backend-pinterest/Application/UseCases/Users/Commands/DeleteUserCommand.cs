using Application.Interfaces.Caching;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest<Unit>, ICacheInvalidator
{
    [BindNever]
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllUsers,
    ];
}