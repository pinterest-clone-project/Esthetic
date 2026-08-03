using Application.UseCases.UserBlock.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.UserBlock.Handlers;

public class BlockUserHandler(IUserBlockRepository blockRepository) : IRequestHandler<BlockUserCommand, Unit>
{
    public async Task<Unit> Handle(BlockUserCommand request, CancellationToken cancellationToken)
    {
        await blockRepository.BlockAsync(request.BlockerId, request.BlockedId, cancellationToken);
        return Unit.Value;
    }
}
