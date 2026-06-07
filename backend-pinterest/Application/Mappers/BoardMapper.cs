using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Entities.Board;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper]
public partial class BoardMapper
{
    // BoardEntity → DTOs
    [MapProperty(nameof(BoardEntity.BoardPins), nameof(BoardDTO.PinsCount),
        Use = nameof(MapPinsCount))]
    public partial BoardDTO ToDto(BoardEntity src);

    [MapProperty(nameof(BoardEntity.BoardPins), nameof(BoardListItemDTO.PinsCount),
        Use = nameof(MapPinsCount))]
    public partial BoardListItemDTO ToListItemDto(BoardEntity src);

    [MapProperty(nameof(BoardEntity.BoardPins), nameof(BoardDetailsDTO.PinsCount),
        Use = nameof(MapPinsCount))]
    [MapProperty(nameof(BoardEntity.BoardPins), nameof(BoardDetailsDTO.PreviewImageUrls),
        Use = nameof(MapPreviewImageUrls))]
    public partial BoardDetailsDTO ToDetailsDto(BoardEntity src);

    // Commands → Entity
    public partial BoardEntity ToEntity(CreateBoardCommand src);

    // Приватні конвертери
    private static int MapPinsCount(ICollection<BoardPinEntity> boardPins) =>
        boardPins.Count;

    private static List<string> MapPreviewImageUrls(ICollection<BoardPinEntity> boardPins) =>
        boardPins
            .OrderByDescending(bp => bp.CreatedAt)
            .Take(4)
            .Select(bp => bp.Pin.MediaUrl)
            .Where(url => url != null)
            .ToList()!;
}