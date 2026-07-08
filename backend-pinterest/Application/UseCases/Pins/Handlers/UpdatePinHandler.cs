using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Mappers;
using Application.UseCases.Pins.Commands;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class UpdatePinHandler(
    IPinRepository pinRepository,
    PinMapper pinMapper,
    IImageService imageService) : IRequestHandler<UpdatePinCommand, Unit>
{
    public async Task<Unit> Handle(UpdatePinCommand request, CancellationToken cancellationToken)
    {
        var pin = await pinRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Pin with ID {request.Id} not found.");

        pinMapper.Patch(request, pin);

        if (request.ImageFile != null)
            pin.Image = await imageService.SaveImageAsync(request.ImageFile);
        else if (!string.IsNullOrWhiteSpace(request.MediaUrl))
            pin.Image = await imageService.SaveImageFromUrlAsync(request.MediaUrl);

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
        return Unit.Value;
    }
}
