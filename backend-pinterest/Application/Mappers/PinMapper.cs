using Application.Models.DTO.Pin;
using Application.Models.DTO.Tag;
using Application.UseCases.Pins.Commands;
using Domain.Entities.Pin;
using Riok.Mapperly.Abstractions;

namespace Application.Mappers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class PinMapper
{
    [MapperIgnoreTarget(nameof(PinEntity.PinTags))]
    [MapperIgnoreTarget(nameof(PinEntity.Image))]
    [MapperIgnoreSource(nameof(CreatePinCommand.ImageFile))]
    [MapperIgnoreSource(nameof(CreatePinCommand.MediaUrl))]
    public partial PinEntity ToEntity(CreatePinCommand src);

    [MapperIgnoreTarget(nameof(PinEntity.PinTags))]
    [MapperIgnoreTarget(nameof(PinEntity.Image))]
    [MapperIgnoreSource(nameof(UpdatePinCommand.ImageFile))]
    [MapperIgnoreSource(nameof(UpdatePinCommand.MediaUrl))]
    public partial PinEntity ToEntity(UpdatePinCommand src);

    [MapperIgnoreTarget(nameof(PinDTO.Tags))]
    [MapperIgnoreTarget(nameof(PinDTO.CategoryName))]
    [MapperIgnoreTarget(nameof(PinDTO.LikesCount))]
    [MapperIgnoreTarget(nameof(PinDTO.CommentsCount))]
    [MapperIgnoreTarget(nameof(PinDTO.IsLikedByMe))]
    private partial PinDTO ToDtoInternal(PinEntity src);

    [MapperIgnoreTarget(nameof(PinSummaryDTO.LikesCount))]
    [MapperIgnoreTarget(nameof(PinSummaryDTO.IsLikedByMe))]
    private partial PinSummaryDTO ToSummaryDtoInternal(PinEntity src);

    public PinDTO ToDto(PinEntity src, Guid? currentUserId = null)
    {
        var dto = ToDtoInternal(src);
        dto.Tags = src.PinTags != null
            ? src.PinTags.Select(pt => new TagDTO { Id = pt.Tag.Id, Name = pt.Tag.Name }).ToList()
            : new List<TagDTO>();
        dto.CategoryName = src.Category?.Name;
        dto.LikesCount = src.Likes?.Count ?? 0;
        dto.CommentsCount = src.Comments?.Count ?? 0;
        dto.CreatorName = src.Creator?.UserName;
        dto.CreatorImage = src.Creator?.Image;
        dto.IsLikedByMe = currentUserId.HasValue
            && (src.Likes?.Any(l => l.UserId == currentUserId.Value) ?? false);
        return dto;
    }

    public PinSummaryDTO ToSummaryDto(PinEntity src, Guid? currentUserId = null)
    {
        var dto = ToSummaryDtoInternal(src);
        dto.LikesCount = src.Likes?.Count ?? 0;
        dto.IsLikedByMe = currentUserId.HasValue
            && (src.Likes?.Any(l => l.UserId == currentUserId.Value) ?? false);
        return dto;
    }
    
    [MapperIgnoreTarget(nameof(PinEntity.PinTags))]
    [MapperIgnoreTarget(nameof(PinEntity.Image))]
    [MapperIgnoreSource(nameof(UpdatePinCommand.ImageFile))]
    [MapperIgnoreSource(nameof(UpdatePinCommand.MediaUrl))]
    public partial void Patch(UpdatePinCommand src, PinEntity dest);
}
