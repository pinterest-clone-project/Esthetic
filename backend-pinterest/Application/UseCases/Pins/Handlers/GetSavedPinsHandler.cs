using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class GetSavedPinsHandler(IPinRepository repository, PinMapper pinMapper)
    : IRequestHandler<GetSavedPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetSavedPinsQuery request, CancellationToken ct)
    {
        var pins = await repository.GetSavedByUserIdAsync(request.UserId, ct);
        return pins.Select(p => pinMapper.ToSummaryDto(p, request.UserId)).ToList();
    }
}
