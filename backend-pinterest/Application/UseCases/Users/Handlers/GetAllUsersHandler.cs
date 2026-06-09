using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class GetAllUsersHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<GetAllUsersQuery, List<UserDTO>>
{
    public async Task<List<UserDTO>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllAsync(cancellationToken);
        return users.Select(userMapper.ToDto).ToList();
    }
}