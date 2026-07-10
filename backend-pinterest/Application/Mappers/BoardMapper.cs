using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Entities.Board;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class BoardMapper
{
    [MapperIgnoreSource(nameof(UpdateBoardCommand.CoverImageFile))]
    [MapperIgnoreTarget(nameof(BoardEntity.CoverImageUrl))]
    public partial void Patch(UpdateBoardCommand src, BoardEntity dest);

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

    public partial BoardEntity ToEntity(CreateBoardCommand src);

    private static int MapPinsCount(ICollection<BoardPinEntity> boardPins) =>
        boardPins.Count;

    private static IReadOnlyList<string> MapPreviewImageUrls(ICollection<BoardPinEntity> boardPins) =>
        boardPins
            .OrderByDescending(bp => bp.CreatedAt)
            .Select(bp => bp.Pin.Image)
            .Where(image => !string.IsNullOrEmpty(image))
            .ToList();
}