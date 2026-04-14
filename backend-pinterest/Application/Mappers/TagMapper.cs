
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using Application.UseCases.Users.Commands;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappers;

public class TagMapper : Profile
{
    public TagMapper()
    {
        CreateMap<TagEntity, TagDTO>();
        CreateMap<CreateTagDTO, TagEntity>();
        CreateMap<UpdateTagCommand, TagEntity>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
