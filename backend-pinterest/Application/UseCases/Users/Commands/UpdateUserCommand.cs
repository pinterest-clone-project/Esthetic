using MediatR;
using Application.UseCases.Users.Requests;
using Domain.Interfaces.Caching;

namespace Application.UseCases.Users.Commands;

public record UpdateUserCommand(Guid Id, UpdateUserRequest Request) : IRequest<Unit>, ICacheInvalidator
{
    public string CacheKey => "users:all";
}
