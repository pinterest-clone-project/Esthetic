using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Pins.Handlers;

public class GetPinSavedLocationsHandler(
    IBoardPinRepository boardPinRepository
) : IRequestHandler<GetPinSavedLocationQuery, List<SavedPinLocationDTO>>
{
    public async Task<List<SavedPinLocationDTO>> Handle(
        GetPinSavedLocationQuery request,
        CancellationToken cancellationToken)
    {
        var locations = await boardPinRepository
            .GetQueryable()
            .Where(bp =>
                bp.PinId == request.PinId &&
                bp.Board.OwnerId == request.UserId &&
                !bp.IsDeleted)
            .Select(bp => new SavedPinLocationDTO
            {
                BoardId = bp.BoardId,
                SectionId = bp.SectionId
            })
            .ToListAsync(cancellationToken);

        return locations;
    }
}
