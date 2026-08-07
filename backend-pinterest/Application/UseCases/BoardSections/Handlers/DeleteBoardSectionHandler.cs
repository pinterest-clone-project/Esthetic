
using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.BoardSections.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.BoardSections.Handlers;

public class DeleteBoardSectionHandler(
    IBoardSectionRepository boardSectionRepository,
    IBoardRepository boardRepository)
    : IRequestHandler<DeleteBoardSectionCommand, Unit>
{
    public async Task<Unit> Handle(DeleteBoardSectionCommand request, CancellationToken cancellationToken)
    {
        var section = await boardSectionRepository.GetByIdAsync(request.Id,
            cancellationToken) ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.BoardSection));

        var board = await boardRepository.GetByIdAsync(section.BoardId,
            cancellationToken) ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        if (board.OwnerId != request.OwnerId)
            throw new UnauthorizedException(ValidationMessages.BoardSectionDelOwnSections);

        await boardSectionRepository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
