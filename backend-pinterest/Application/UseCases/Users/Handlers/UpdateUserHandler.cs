using Application.Mappers;
using Application.UseCases.Users.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class UpdateUserHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<UpdateUserCommand, Unit>
{
    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException("User not found");

        userMapper.Patch(request, user);
        await userRepository.UpdateAsync(user);
        return Unit.Value;
    }
}