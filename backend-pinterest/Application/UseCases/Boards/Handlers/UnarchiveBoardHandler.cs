using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class UnarchiveBoardHandler(IBoardRepository boardRepository)
    : IRequestHandler<UnarchiveBoardCommand, Unit>
{
    public async Task<Unit> Handle(UnarchiveBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        if (board.OwnerId != request.OwnerId)
            throw new ForbiddenException(ValidationMessages.ErrorNoPermission);

        board.IsArchived = false;
        await boardRepository.UpdateAsync(board, cancellationToken);

        return Unit.Value;
    }
}
