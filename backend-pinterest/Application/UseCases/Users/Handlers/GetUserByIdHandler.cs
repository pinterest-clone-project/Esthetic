using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class GetUserByIdHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<GetUserByIdQuery, UserDTO?>
{
    public async Task<UserDTO?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null) return null;
        return userMapper.ToDto(user);
    }
}