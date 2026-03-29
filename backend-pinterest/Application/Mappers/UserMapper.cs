using Application.UseCases.Users.Commands;
using Application.UseCases.Users.Dto;
using Application.UseCases.Users.Requests;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserDto>();

        CreateMap<CreateUserRequest, UserEntity>();
        CreateMap<UpdateUserRequest, UserEntity>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
