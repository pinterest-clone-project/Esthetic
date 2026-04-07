
using Application.Models.DTO.Tag;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappers;

public class TagMapper : Profile
{
    public TagMapper()
    {
        CreateMap<TagEntity, TagDTO>();
        CreateMap<CreateTagDTO, TagEntity>();
    }
}
