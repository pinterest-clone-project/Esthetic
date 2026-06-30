using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Commands;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class BlockUserHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<AdminBlockUserCommand, UserDTO>
{
    public async Task<UserDTO> Handle(AdminBlockUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.NotFound(nameof(UserEntity)));

        if (user.IsBlocked)
            throw new BadRequestException(ValidationMessages.UserAlreadyBlocked);

        user.IsBlocked = true;
        user.BlockReason = request.Reason;

        await userRepository.UpdateAsync(user, cancellationToken);
        return userMapper.ToDto(user);
    }
}
