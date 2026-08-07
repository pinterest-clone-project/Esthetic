
using Application.Models.DTO.BoardSection;
using Application.UseCases.BoardSections.Commands;
using Domain.Entities.Board;
using Domain.Entities.BoardSection;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class BoardSectionMapper (PinMapper pinMapper)
{
    [MapProperty(nameof(BoardSectionEntity.BoardPins),
        nameof(BoardSectionDTO.PinsCount),
        Use = nameof(MapPinsCount))]
    [MapperIgnoreTarget(nameof(BoardSectionDTO.PreviewPins))]
    public partial BoardSectionDTO ToDtoInternal(BoardSectionEntity src);

    public BoardSectionDTO ToDto(BoardSectionEntity src,
        Guid? currentUserId = null)
    {
        var dto = ToDtoInternal(src);

        dto.PreviewPins = src.BoardPins.Where(bp => !bp.IsDeleted)
            .OrderByDescending(bp => bp.CreatedAt)
            .Take(3)
            .Select(bp => pinMapper.ToSummaryDto(bp.Pin, currentUserId))
            .ToList();

        dto.PinsCount = src.BoardPins.Count(bp => !bp.IsDeleted);

        return dto;
    }

    [MapperIgnoreTarget(nameof(BoardSectionDetailsDTO.Pins))]
    [MapperIgnoreTarget(nameof(BoardSectionDetailsDTO.PinsCount))]
    public partial BoardSectionDetailsDTO ToDetailsDtoInternal(BoardSectionEntity src);

    public BoardSectionDetailsDTO ToDetailsDto(BoardSectionEntity src,
        Guid? currentUserId = null)
    {
        var dto = ToDetailsDtoInternal(src);

        dto.OwnerId = src.Board.OwnerId;

        dto.Pins = src.BoardPins.Where(bp => !bp.IsDeleted)
            .OrderByDescending(bp => bp.CreatedAt)
            .Select(bp => pinMapper.ToSummaryDto(bp.Pin, currentUserId))
            .ToList();

        dto.PinsCount = src.BoardPins.Count(bp => !bp.IsDeleted);

        return dto;
    }

    [MapperIgnoreTarget(nameof(BoardSectionEntity.Board))]
    public partial BoardSectionEntity ToEntity(CreateBoardSectionCommand src);

    [MapperIgnoreTarget(nameof(BoardSectionEntity.Board))]
    public partial void Patch(UpdateBoardSectionCommand src,
        BoardSectionEntity dest);

    private static int MapPinsCount(ICollection<BoardPinEntity> boardPins)
    {
        return boardPins.Count(bp => !bp.IsDeleted);
    }
}
