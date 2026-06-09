using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class CreateBoardHandler(
    IBoardRepository boardRepository,
    IImageService imageService,
    BoardMapper mapper) : IRequestHandler<CreateBoardCommand, BoardDTO>
{
    public async Task<BoardDTO> Handle(CreateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = mapper.ToEntity(request);
        board.OwnerId = request.OwnerId;

        if (request.CoverImageFile != null)
        {
            board.CoverImageUrl = await imageService.SaveImageAsync(request.CoverImageFile);
        }

        var createdBoard = await boardRepository.AddAsync(board, cancellationToken);

        return mapper.ToDto(createdBoard);
    }
}