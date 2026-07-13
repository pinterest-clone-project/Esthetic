using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class GetDeletedPinsHandler(IPinRepository repository, PinMapper pinMapper)
    : IRequestHandler<GetDeletedPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetDeletedPinsQuery request, CancellationToken ct)
    {
        var pins = await repository.GetDeletedByUserAsync(request.UserId, ct);
        return pins.Select(p =>
        {
            var dto = pinMapper.ToSummaryDto(p, request.UserId);
            dto.DeletedAt = p.DeletedAt;
            return dto;
        }).ToList();
    }
}
