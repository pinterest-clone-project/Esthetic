using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.UseCases.Pins.Commands;
using Domain.Entities.Board;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Pins.Handlers;
public class UnsavePinHandler(
    IBoardPinRepository boardPinRepository,
    IBoardRepository boardRepository,
    IPinRepository pinRepository,
    IImageService imageService) : IRequestHandler<UnsavePinCommand, Unit>
{
    public async Task<Unit> Handle(UnsavePinCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.BoardId, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Board"));

        if (board.OwnerId != request.UserId)
            throw new ForbiddenException(ValidationMessages.ErrorNoPermission);

        var boardPin = await boardPinRepository
            .GetQueryable()
            .FirstOrDefaultAsync(
                bp =>
                    bp.PinId == request.PinId &&
                    bp.BoardId == request.BoardId &&
                    bp.SectionId == request.SectionId,
                cancellationToken);

        if (boardPin == null)
        {
            throw new KeyNotFoundException(
                ValidationMessages.NotFound("Saved pin")
            );
        }

        await boardPinRepository.DeleteAsync(boardPin.Id, cancellationToken);

        await RegenerateCollageAsync(board, cancellationToken);

        return Unit.Value;
    }


    private async Task RegenerateCollageAsync(BoardEntity board, CancellationToken cancellationToken)
    {
        var pinIds = await boardPinRepository.GetQueryable()
    .Where(bp =>
        bp.BoardId == board.Id &&
        bp.SectionId == null &&
        !bp.IsDeleted)
    .OrderByDescending(bp => bp.CreatedAt)
    .Take(4)
    .Select(bp => bp.PinId)
    .ToListAsync(cancellationToken);


        var oldCover = board.CoverImageUrl;

        if (pinIds.Count == 0)
        {
            board.CoverImageUrl = null;
            await boardRepository.UpdateAsync(board, cancellationToken);
        }
        else
        {
            var pinImageMap = await pinRepository.GetQueryable()
                .Where(p => pinIds.Contains(p.Id))
                .Select(p => new { p.Id, p.Image })
                .ToListAsync(cancellationToken);

            var pinImages = pinIds
                .Select(id => pinImageMap.FirstOrDefault(p => p.Id == id)?.Image)
                .Where(img => img != null)
                .Cast<string>()
                .ToList();

            if (pinImages.Count > 0)
            {
                board.CoverImageUrl = await imageService.CreateCollageAsync(pinImages);
                await boardRepository.UpdateAsync(board, cancellationToken);
            }
        }

        if (!string.IsNullOrEmpty(oldCover))
            await imageService.DeleteImageAsync(oldCover);
    }
}
