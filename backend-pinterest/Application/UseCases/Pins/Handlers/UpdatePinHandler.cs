using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Mappers;
using Application.UseCases.Pins.Commands;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Pins.Handlers;

public class UpdatePinHandler(
    IPinRepository pinRepository,
    PinMapper pinMapper,
    IImageService imageService,
    IBoardPinRepository boardPinRepository,
    IBoardRepository boardRepository) : IRequestHandler<UpdatePinCommand, Unit>
{
    public async Task<Unit> Handle(UpdatePinCommand request, CancellationToken cancellationToken)
    {
        var pin = await pinRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Pin with ID {request.Id} not found.");

        pinMapper.Patch(request, pin);

        var imageChanged = false;

        if (request.ImageFile != null)
        {
            pin.Image = await imageService.SaveImageAsync(request.ImageFile);
            imageChanged = true;
        }
        else if (!string.IsNullOrWhiteSpace(request.MediaUrl))
        {
            pin.Image = await imageService.SaveImageFromUrlAsync(request.MediaUrl);
            imageChanged = true;
        }

        if (request.TagIds != null)
        {
            pin.PinTags ??= [];
            pin.PinTags.Clear();

            foreach (var tagId in request.TagIds.Distinct())
            {
                pin.PinTags.Add(new PinTagEntity { PinId = pin.Id, TagId = tagId });
            }
        }

        await pinRepository.UpdateAsync(pin, cancellationToken);

        if (imageChanged)
            await RegenerateCollagesForPinAsync(pin.Id, pin.Image!, cancellationToken);

        return Unit.Value;
    }

    private async Task RegenerateCollagesForPinAsync(Guid pinId, string newImage, CancellationToken cancellationToken)
    {
        var boardIds = await boardPinRepository.GetQueryable()
            .Where(bp => bp.PinId == pinId && !bp.IsDeleted)
            .Select(bp => bp.BoardId)
            .Distinct()
            .ToListAsync(cancellationToken);

        foreach (var boardId in boardIds)
        {
            var board = await boardRepository.GetByIdAsync(boardId, cancellationToken);
            if (board == null) continue;

            var pinIds = await boardPinRepository.GetQueryable()
                .Where(bp => bp.BoardId == boardId && !bp.IsDeleted)
                .OrderByDescending(bp => bp.CreatedAt)
                .Take(4)
                .Select(bp => bp.PinId)
                .ToListAsync(cancellationToken);

            var pinImages = await pinRepository.GetQueryable()
                .Where(p => pinIds.Contains(p.Id))
                .Select(p => new { p.Id, p.Image })
                .ToListAsync(cancellationToken);

            var images = pinIds
                .Select(id => pinImages.FirstOrDefault(p => p.Id == id)?.Image)
                .Where(img => img != null)
                .Cast<string>()
                .ToList();

            if (images.Count == 0) continue;

            var oldCover = board.CoverImageUrl;
            board.CoverImageUrl = await imageService.CreateCollageAsync(images);
            await boardRepository.UpdateAsync(board, cancellationToken);

            if (!string.IsNullOrEmpty(oldCover))
                await imageService.DeleteImageAsync(oldCover);
        }
    }
}
