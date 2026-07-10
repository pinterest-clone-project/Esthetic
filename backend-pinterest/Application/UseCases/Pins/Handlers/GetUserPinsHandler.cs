using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class GetUserPinsHandler(IPinRepository repository, PinMapper pinMapper)
    : IRequestHandler<GetUserPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetUserPinsQuery request, CancellationToken ct)
    {
        var pins = await repository.GetByUserIdAsync(request.UserId, ct);
        return pins.Select(p => pinMapper.ToSummaryDto(p, request.CurrentUserId)).ToList();
    }
}
