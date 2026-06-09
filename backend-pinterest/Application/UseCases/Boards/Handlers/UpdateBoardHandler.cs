using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class UpdateBoardHandler(
    IBoardRepository boardRepository,
    IImageService imageService,
    BoardMapper boardMapper) : IRequestHandler<UpdateBoardCommand, BoardDTO>
{
    public async Task<BoardDTO> Handle(UpdateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Board));

        if (board.OwnerId != request.OwnerId)
            throw new UnauthorizedException(ValidationMessages.BoardUpdateOwnBoards);

        boardMapper.Patch(request, board);

        if (request.CoverImageFile != null)
            board.CoverImageUrl = await imageService.SaveImageAsync(request.CoverImageFile);

        await boardRepository.UpdateAsync(board, cancellationToken);
        return boardMapper.ToDto(board);
    }
}