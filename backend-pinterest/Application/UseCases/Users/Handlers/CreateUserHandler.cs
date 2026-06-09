using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class CreateUserHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<CreateUserCommand, UserDTO>
{
    public async Task<UserDTO> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = userMapper.ToEntity(request);
        var created = await userRepository.AddAsync(user, cancellationToken);
        return userMapper.ToDto(created);
    }
}