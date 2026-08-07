
using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.Models.DTO.BoardSection;
using Application.UseCases.BoardSections.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.BoardSections.Handlers;

public class GetBoardSectionByIdHandler(IBoardSectionRepository boardSectionRepository,
    BoardSectionMapper mapper): IRequestHandler<GetBoardSectionByIdQuery, BoardSectionDetailsDTO>
{
    public async Task<BoardSectionDetailsDTO> Handle(GetBoardSectionByIdQuery request, CancellationToken cancellationToken)
    {
        var section = await boardSectionRepository.GetQueryable()
            .Include(s => s.BoardPins)
            .ThenInclude(bp => bp.Pin)
            .ThenInclude(p => p.Likes)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if(section == null)
            throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.BoardSection));

        return mapper.ToDetailsDto(section, request.CurrentUserId);

    }
}
