using Application.Models.DTO.Board;
using Application.UseCases.Boards.Commands;
using Domain.Entities.Board;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class BoardMapper(PinMapper pinMapper)
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

    [MapProperty(nameof(BoardEntity.BoardPins), nameof(BoardDetailsDTO.PinsCount), Use = nameof(MapPinsCount))]
    [MapperIgnoreTarget(nameof(BoardDetailsDTO.PreviewPins))]
    private partial BoardDetailsDTO ToDetailsDtoInternal(BoardEntity src);

    public BoardDetailsDTO ToDetailsDto(BoardEntity src, Guid? currentUserId = null)
    {
        var dto = ToDetailsDtoInternal(src);
        dto.PreviewPins = src.BoardPins
            .OrderByDescending(bp => bp.CreatedAt)
            .Select(bp => pinMapper.ToSummaryDto(bp.Pin, currentUserId))
            .ToList();
        return dto;
    }

    public partial BoardEntity ToEntity(CreateBoardCommand src);

    private static int MapPinsCount(ICollection<BoardPinEntity> boardPins) =>
        boardPins.Count;


}