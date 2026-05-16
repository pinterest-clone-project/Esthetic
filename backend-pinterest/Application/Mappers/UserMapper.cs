using Application.Models.DTO;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Application.UseCases.Users.Commands;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserDTO>();

        CreateMap<CreateUserCommand, UserEntity>();
        CreateMap<UpdateUserCommand, UserEntity>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<RegisterCommand, UserEntity>();

        CreateMap<GoogleAccountModel, UserEntity>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Image, opt => opt.Ignore());
    }
}
