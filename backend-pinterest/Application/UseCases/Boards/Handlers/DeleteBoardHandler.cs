using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class DeleteBoardHandler(
    IBoardRepository boardRepository) : IRequestHandler<DeleteBoardCommand, Unit>
{
    public async Task<Unit> Handle(DeleteBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        if (board.OwnerId != request.OwnerId)
            throw new UnauthorizedException(ValidationMessages.BoardDelOwnBoards);

        await boardRepository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}