using MediatR;
using Application.UseCases.Users.Requests;

namespace Application.UseCases.Users.Commands;

public record UpdateUserCommand(Guid Id, UpdateUserRequest Request) : IRequest<Unit>;
