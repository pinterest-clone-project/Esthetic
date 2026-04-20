using Application.Models.SeedDTO;
using AutoMapper;
using Domain.Entities.Identity;
using Domain.Entities.Tag;

namespace Application.Mappers;

public class SeederMapper : Profile
{
    public SeederMapper()
    {
        CreateMap<UserSeedDTO, UserEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore());

        CreateMap<TagSeedDTO, TagEntity>();
    }
}