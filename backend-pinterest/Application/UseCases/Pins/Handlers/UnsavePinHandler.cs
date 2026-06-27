using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class UnsavePinHandler(
    IBoardPinRepository boardPinRepository,
    IBoardRepository boardRepository) : IRequestHandler<UnsavePinCommand, Unit>
{
    public async Task<Unit> Handle(UnsavePinCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.BoardId, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Board"));

        if (board.OwnerId != request.UserId)
            throw new ForbiddenException(ValidationMessages.ErrorNoPermission);

        var boardPin = await boardPinRepository.GetByPinAndBoardAsync(request.PinId, request.BoardId, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Saved pin"));

        await boardPinRepository.DeleteAsync(boardPin.Id, cancellationToken);
        return Unit.Value;
    }
}
