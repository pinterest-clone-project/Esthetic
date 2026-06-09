using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class GetUserPinsHandler(
    IPinRepository repository,
    PinMapper pinMapper) : IRequestHandler<GetUserPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetUserPinsQuery request, CancellationToken cancellationToken)
    {
        var pins = await repository.GetByUserIdAsync(request.UserId, cancellationToken);
        return pins.Select(pinMapper.ToSummaryDto).ToList();
    }
}