using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Pins.Handlers;
public class GetPinSavedBoardsHandler(IBoardPinRepository boardPinRepository, IBoardRepository boardRepository)
    : IRequestHandler<GetPinSavedBoardsQuery, List<Guid>>
{
    public async Task<List<Guid>> Handle(GetPinSavedBoardsQuery request, CancellationToken cancellationToken)
    {
        var userBoardIds = boardRepository.GetQueryable()
            .Where(b => b.OwnerId == request.UserId)
            .Select(b => b.Id);

        return await boardPinRepository.GetQueryable()
            .Where(bp => bp.PinId == request.PinId && userBoardIds.Contains(bp.BoardId) && bp.SectionId == null)
            .Select(bp => bp.BoardId)
            .ToListAsync(cancellationToken);
    }
}
