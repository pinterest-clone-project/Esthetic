using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;

namespace Application.UseCases.Users.Handlers;

public class DeleteUserHandler(
    IUserRepository userRepository) : IRequestHandler<DeleteUserCommand, Unit>
{
    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await userRepository.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
