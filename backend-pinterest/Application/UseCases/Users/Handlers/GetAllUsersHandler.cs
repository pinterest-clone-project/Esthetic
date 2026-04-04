using MediatR;
using Domain.Interfaces;
using Application.UseCases.Users.Queries;
using AutoMapper;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Handlers;

public class GetAllUsersHandler(
    IUserRepository userRepository,
    IMapper mapper) : IRequestHandler<GetAllUsersQuery, List<UserDTO>>
{
    public async Task<List<UserDTO>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllAsync();
        return mapper.Map<List<UserDTO>>(users);
    }
}
