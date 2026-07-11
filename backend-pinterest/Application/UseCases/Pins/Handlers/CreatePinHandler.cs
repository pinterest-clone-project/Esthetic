using Application.Common;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Commands;
using Domain.Entities.PinTag;
using Domain.Events;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class CreatePinHandler(
    IPinRepository repository,
    PinMapper pinMapper,
    IImageService imageService, 
    IUserRepository userRepository,
    IMediator mediator) : IRequestHandler<CreatePinCommand, PinDTO> 
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

        var creator = await userRepository.GetByIdAsync(created.CreatorId, cancellationToken);

        await mediator.Publish(new DomainEventNotification<PinCreatedEvent>(
            new PinCreatedEvent(
                created.CreatorId,
                created.Id,
                creator!.UserName!,
                creator.Image,
                created.Title!
            )),
        cancellationToken);

        var withDetails = await repository.GetByIdWithDetailsAsync(created.Id, cancellationToken);

        return pinMapper.ToDto(withDetails);
    }
}
