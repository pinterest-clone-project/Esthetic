using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.UseCases.Pins.Commands;
using Domain.Entities.Board;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.UseCases.Pins.Handlers;
public class SavePinHandler(
    IBoardPinRepository boardPinRepository,
    IBoardRepository boardRepository,
    IPinRepository pinRepository,
    IImageService imageService,
    ILogger<SavePinHandler> logger) : IRequestHandler<SavePinCommand, Unit>
{
    public async Task<Unit> Handle(SavePinCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.BoardId, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Board"));

        if (board.OwnerId != request.UserId)
            throw new ForbiddenException(ValidationMessages.ErrorNoPermission);

        var existing = await boardPinRepository.GetByPinAndBoardIncludingDeletedAsync(request.PinId, request.BoardId, cancellationToken);

        if (existing != null)
        {
            if (!existing.IsDeleted)
            {
                existing.SectionId = request.SectionId;
                await boardPinRepository.UpdateAsync(existing, cancellationToken);

                await RegenerateCollageAsync(board, cancellationToken);

                return Unit.Value;
            }


            existing.IsDeleted = false;
            existing.SectionId = request.SectionId;

            await boardPinRepository.UpdateAsync(existing, cancellationToken);
        }

        else
        {
            var boardPin = new BoardPinEntity
            {
                BoardId = request.BoardId,
                PinId = request.PinId,
                SectionId = request.SectionId
            };
            await boardPinRepository.AddAsync(boardPin, cancellationToken);
        }

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


        if (pinIds.Count == 0)
            return;

        var pinImageMap = await pinRepository.GetQueryable()
            .Where(p => pinIds.Contains(p.Id))
            .Select(p => new { p.Id, p.Image })
            .ToListAsync(cancellationToken);

        var pinImages = pinIds
            .Select(id => pinImageMap.FirstOrDefault(p => p.Id == id)?.Image)
            .Where(img => img != null)
            .Cast<string>()
            .ToList();

        if (pinImages.Count == 0)
            return;

        var oldCover = board.CoverImageUrl;
        var newCover = await imageService.CreateCollageAsync(pinImages);
        logger.LogInformation("Collage generated: {NewCover} (old: {OldCover})", newCover, oldCover);

        board.CoverImageUrl = newCover;
        await boardRepository.UpdateAsync(board, cancellationToken);
        logger.LogInformation("Board {BoardId} CoverImageUrl updated to {NewCover}", board.Id, newCover);

        if (!string.IsNullOrEmpty(oldCover))
            await imageService.DeleteImageAsync(oldCover);
    }
}
