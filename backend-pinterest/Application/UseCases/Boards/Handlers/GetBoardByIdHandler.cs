using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Boards.Handlers;

public class GetBoardByIdHandler(
    IBoardRepository boardRepository,
    BoardMapper boardMapper) : IRequestHandler<GetBoardByIdQuery, BoardDetailsDTO>
{
    public async Task<BoardDetailsDTO> Handle(GetBoardByIdQuery request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetQueryable()
        .Include(b => b.BoardPins).ThenInclude(bp => bp.Pin).ThenInclude(p => p.Likes)
        .AsSplitQuery()
        .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken)
        ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        board.BoardPins = board.BoardPins.Where(p => p.SectionId == null).ToList();

        if (board.IsPrivate && board.OwnerId != request.CurrentUserId)
            throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        return boardMapper.ToDetailsDto(board, request.CurrentUserId);
    }
}