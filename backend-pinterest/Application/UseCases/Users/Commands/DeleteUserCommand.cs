using MediatR;

namespace Application.UseCases.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest<Unit>;
