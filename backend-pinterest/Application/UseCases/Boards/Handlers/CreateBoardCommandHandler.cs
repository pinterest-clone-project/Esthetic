using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Entities.Board;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Boards.Handlers;

public class CreateBoardHandler(
    IBoardRepository boardRepository,
    IBoardPinRepository boardPinRepository,
    IPinRepository pinRepository,
    IImageService imageService,
    BoardMapper mapper) : IRequestHandler<CreateBoardCommand, BoardDTO>
{
    public async Task<BoardDTO> Handle(CreateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = mapper.ToEntity(request);
        board.OwnerId = request.OwnerId;

        var createdBoard = await boardRepository.AddAsync(board, cancellationToken);

        var pinIds = request.PinIds?.Distinct().ToList() ?? [];

        if (pinIds.Count > 0)
        {
            var boardPins = pinIds.Select(pinId => new BoardPinEntity
            {
                BoardId = createdBoard.Id,
                PinId = pinId,
            });

            await boardPinRepository.AddRangeAsync(boardPins, cancellationToken);

            var pinImages = await pinRepository.GetQueryable()
                .Where(p => pinIds.Take(4).Contains(p.Id))
                .Select(p => p.Image)
                .Where(image => image != null)
                .Cast<string>()
                .ToListAsync(cancellationToken);

            if (pinImages.Count > 0)
            {
                createdBoard.CoverImageUrl = await imageService.CreateCollageAsync(pinImages);
                await boardRepository.UpdateAsync(createdBoard, cancellationToken);
            }
        }

        return mapper.ToDto(createdBoard);
    }
}