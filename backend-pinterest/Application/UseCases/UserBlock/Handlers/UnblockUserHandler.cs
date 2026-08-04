using Application.UseCases.UserBlock.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.UserBlock.Handlers;

public class UnblockUserHandler(IUserBlockRepository blockRepository) : IRequestHandler<UnblockUserCommand, Unit>
{
    public async Task<Unit> Handle(UnblockUserCommand request, CancellationToken cancellationToken)
    {
        await blockRepository.UnblockAsync(request.BlockerId, request.BlockedId, cancellationToken);
        return Unit.Value;
    }
}
