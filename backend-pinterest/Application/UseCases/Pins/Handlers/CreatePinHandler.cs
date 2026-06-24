using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Commands;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class CreatePinHandler(
    IPinRepository repository,
    PinMapper pinMapper,
    IImageService imageService) : IRequestHandler<CreatePinCommand, PinDTO>
{
    public async Task<PinDTO> Handle(CreatePinCommand request, CancellationToken cancellationToken)
    {
        var entity = pinMapper.ToEntity(request);

        if (request.ImageFile != null)
            entity.Image = await imageService.SaveImageAsync(request.ImageFile);
        else if (!string.IsNullOrWhiteSpace(request.MediaUrl))
            entity.Image = await imageService.SaveImageFromUrlAsync(request.MediaUrl);

        if (request.TagIds != null)
            entity.PinTags = request.TagIds
                .Select(id => new PinTagEntity { TagId = id })
                .ToList();

        var created = await repository.AddAsync(entity, cancellationToken);
        var withDetails = await repository.GetByIdWithDetailsAsync(created.Id, cancellationToken);
        return pinMapper.ToDto(withDetails);
    }
}
