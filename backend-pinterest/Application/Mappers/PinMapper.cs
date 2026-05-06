using Application.Models.DTO.Pin;
using Application.Models.DTO.Tag;
using Application.UseCases.Pins.Commands;
using AutoMapper;
using Domain.Entities.Pin;

namespace Application.Mappers;

public class PinMapper : Profile
{
    public PinMapper()
    {
        CreateMap<CreatePinCommand, PinEntity>();
        CreateMap<UpdatePinCommand, PinEntity>()
            .ForMember(dest => dest.PinTags, opt => opt.Ignore()); // handled manually

        CreateMap<PinEntity, PinDTO>()
            .ForMember(dest => dest.Tags, opt =>
                opt.MapFrom(src => src.PinTags != null
                    ? src.PinTags.Select(pt => new TagDTO { Id = pt.Tag.Id, Name = pt.Tag.Name })
                    : new List<TagDTO>()))
            .ForMember(dest => dest.CategoryName, opt =>
                opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.LikesCount, opt =>
                opt.MapFrom(src => src.Likes != null ? src.Likes.Count : 0))
            .ForMember(dest => dest.CommentsCount, opt =>
                opt.MapFrom(src => src.Comments != null ? src.Comments.Count : 0));

        CreateMap<PinEntity, PinSummaryDTO>()
            .ForMember(dest => dest.LikesCount, opt =>
                opt.MapFrom(src => src.Likes != null ? src.Likes.Count : 0));
    }
}
