
using Application.Mappers;
using Application.Models.DTO.BoardSection;
using Application.UseCases.BoardSections.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.BoardSections.Handlers;

public class GetBoardSectionHandler(IBoardSectionRepository boardSectionRepository,
    BoardSectionMapper mapper): IRequestHandler<GetBoardSectionsQuery, List<BoardSectionDTO>>
{
    public async Task<List<BoardSectionDTO>> Handle(GetBoardSectionsQuery request, CancellationToken cancellationToken)
    {
        var sections = await boardSectionRepository.GetQueryable()
            .Where(s => s.BoardId == request.BoardId)
            .Include(s => s.BoardPins)
            .ThenInclude(bp => bp.Pin)
            .OrderByDescending(s => s.CreatedAt)
            .Take(3)
            .ToListAsync(cancellationToken);
        return sections.Select(s => mapper.ToDto(s, request.CurrentUserId))
            .ToList();
    }
}
