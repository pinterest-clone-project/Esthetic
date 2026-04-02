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
    }
}
