using Application.Models.DTO.Pin;
using Application.Models.DTO.Tag;
using Application.UseCases.Pins.Commands;
using AutoMapper;
using Domain.Entities.Pin;
using Domain.Entities.PinTag;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class CreatePinHandler(IPinRepository repository, IMapper mapper)
    : IRequestHandler<CreatePinCommand, PinDTO>
{
    public async Task<PinDTO> Handle(CreatePinCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<PinEntity>(request);

        if (request.TagIds != null)
            entity.PinTags = request.TagIds
                .Select(id => new PinTagEntity { TagId = id })
                .ToList();

        var created = await repository.AddAsync(entity, cancellationToken);
        var withDetails = await repository.GetByIdWithDetailsAsync(created.Id, cancellationToken);
        return mapper.Map<PinDTO>(withDetails);
    }
}
