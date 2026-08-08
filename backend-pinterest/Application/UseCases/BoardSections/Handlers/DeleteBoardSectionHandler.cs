
using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.BoardSections.Commands;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.BoardSections.Handlers;

public class DeleteBoardSectionHandler(
    IBoardSectionRepository boardSectionRepository,
    IBoardRepository boardRepository,
    IBoardPinRepository boardPinRepository)
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

        var sectionPins = await boardPinRepository.GetQueryable()
            .Where(bp => bp.SectionId == request.Id)
            .ToListAsync(cancellationToken);

        foreach (var bp in sectionPins)
        {
            bp.SectionId = null;
            await boardPinRepository.UpdateAsync(bp, cancellationToken);
        }

        await boardSectionRepository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
