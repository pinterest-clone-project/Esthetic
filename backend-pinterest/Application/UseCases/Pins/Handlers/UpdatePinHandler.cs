using Application.UseCases.Pins.Commands;
using AutoMapper;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;
using Application.Common.Validators;

namespace Application.UseCases.Pins.Handlers;
public class UpdatePinHandler(IPinRepository repository, IMapper mapper)
    : IRequestHandler<UpdatePinCommand, Unit>
{
    public async Task<Unit> Handle(UpdatePinCommand request, CancellationToken cancellationToken)
    {
        var pin = await repository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
        if (pin == null) throw new KeyNotFoundException(ValidationMessages.NotFound("Pin"));

        mapper.Map(request, pin);

        if (request.TagIds != null)
            pin.PinTags = request.TagIds
                .Select(id => new PinTagEntity { TagId = id })
                .ToList();

        await repository.UpdateAsync(pin, cancellationToken);
        return Unit.Value;
    }
}
