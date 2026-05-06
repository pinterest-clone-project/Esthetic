using Application.Models.SeedDTO;
using AutoMapper;
using Domain.Entities.Category;
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

        CreateMap<CategorySeedDTO, CategoryEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());
    }
}