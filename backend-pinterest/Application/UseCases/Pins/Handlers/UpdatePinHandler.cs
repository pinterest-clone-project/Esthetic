using Application.Common.Validators;
using Application.Mappers;
using Application.UseCases.Pins.Commands;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class UpdatePinHandler(
    IPinRepository repository,
    PinMapper pinMapper) : IRequestHandler<UpdatePinCommand, Unit>
{
    public async Task<Unit> Handle(UpdatePinCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine($"----- {request.MediaUrl}");
        var pin = await repository.GetByIdWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException(ValidationMessages.NotFound("Pin"));

        pinMapper.Patch(request, pin);

        if (request.MediaUrl != null)
            pin.MediaUrl = request.MediaUrl;

        if (request.TagIds != null)
            pin.PinTags = request.TagIds
                .Select(id => new PinTagEntity { TagId = id })
                .ToList();

        await repository.UpdateAsync(pin, cancellationToken);
        return Unit.Value;
    }
}
