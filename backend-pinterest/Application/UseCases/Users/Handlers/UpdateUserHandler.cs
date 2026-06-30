using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class UpdateUserHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<UpdateUserCommand, UserDTO>
{
    public async Task<UserDTO> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.UserNotFound);

        userMapper.Patch(request, user);
        await userRepository.UpdateAsync(user, cancellationToken);
        return userMapper.ToDto(user);
    }
}