using MediatR;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.UseCases.Users.Commands;
using AutoMapper;
using Application.Models.DTO.User;

namespace Application.UseCases.Users.Handlers;

public class CreateUserHandler(
    IUserRepository userRepository,
    IMapper mapper) : IRequestHandler<CreateUserCommand, UserDTO>
{
    public async Task<UserDTO> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<UserEntity>(request);
        var created = await userRepository.AddAsync(user, cancellationToken);
        return mapper.Map<UserDTO>(created);
    }
}
