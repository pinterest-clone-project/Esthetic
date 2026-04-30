using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class UpdateBoardHandler(
    IBoardRepository boardRepository,
    IImageService imageService,
    IMapper mapper) : IRequestHandler<UpdateBoardCommand, BoardDTO>
{
    public async Task<BoardDTO> Handle(UpdateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = await boardRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Board not found");

        if (board.OwnerId != request.OwnerId)
            throw new UnauthorizedException("You can only update your own boards");

        mapper.Map(request, board);

        if (request.CoverImageFile != null)
        {
            board.CoverImageUrl = await imageService.SaveImageAsync(request.CoverImageFile);
        }

        await boardRepository.UpdateAsync(board, cancellationToken);

        return mapper.Map<BoardDTO>(board);
    }
}