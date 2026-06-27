using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using Domain.Entities.Board;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class SavePinHandler(
    IBoardPinRepository boardPinRepository,
    IBoardRepository boardRepository) : IRequestHandler<SavePinCommand, Unit>
{
    public async Task<Unit> Handle(SavePinCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.BoardId, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Board"));

        if (board.OwnerId != request.UserId)
            throw new ForbiddenException(ValidationMessages.ErrorNoPermission);

        var alreadySaved = await boardPinRepository.ExistsAsync(request.PinId, request.BoardId, cancellationToken);
        if (alreadySaved)
            return Unit.Value;

        var boardPin = new BoardPinEntity
        {
            BoardId = request.BoardId,
            PinId = request.PinId,
        };

        await boardPinRepository.AddAsync(boardPin, cancellationToken);
        return Unit.Value;
    }
}
