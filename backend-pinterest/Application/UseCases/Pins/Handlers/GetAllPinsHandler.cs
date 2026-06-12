using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class GetAllPinsHandler(
    IPinRepository repository,
    PinMapper pinMapper) : IRequestHandler<GetAllPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetAllPinsQuery request, CancellationToken cancellationToken)
    {
        var pins = await repository.GetAllWithDetailsAsync(cancellationToken);
        return pins.Select(pinMapper.ToSummaryDto).ToList();
    }
}