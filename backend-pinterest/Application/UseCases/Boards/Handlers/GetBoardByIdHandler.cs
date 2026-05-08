using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Boards.Handlers;

public class GetBoardByIdHandler(
    IBoardRepository boardRepository,
    IMapper mapper) : IRequestHandler<GetBoardByIdQuery, BoardDetailsDTO>
{
    public async Task<BoardDetailsDTO> Handle(
        GetBoardByIdQuery request,
        CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetQueryable()
            .Include(b => b.BoardPins)
                .ThenInclude(bp => bp.Pin)
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        return mapper.Map<BoardDetailsDTO>(board);
    }
}