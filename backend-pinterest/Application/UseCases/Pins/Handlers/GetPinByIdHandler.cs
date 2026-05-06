using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class GetPinByIdHandler(IPinRepository repository, IMapper mapper)
    : IRequestHandler<GetPinByIdQuery, PinDTO?>
{
    public async Task<PinDTO?> Handle(GetPinByIdQuery request, CancellationToken cancellationToken)
    {
        var pin = await repository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
        if (pin == null) return null;
        return mapper.Map<PinDTO>(pin);
    }
}
