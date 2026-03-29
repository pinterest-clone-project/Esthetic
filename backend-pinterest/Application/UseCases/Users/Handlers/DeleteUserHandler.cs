using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;

namespace Application.UseCases.Users.Handlers;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IUserRepository _repo;
    public DeleteUserHandler(IUserRepository repo) => _repo = repo;

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await _repo.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
