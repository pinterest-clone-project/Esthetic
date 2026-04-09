using Application.UseCases.Users.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class UpdateUserHandler(
    IUserRepository userRepository,
    IMapper mapper) : IRequestHandler<UpdateUserCommand, Unit>
{
    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id);
        if (user == null) throw new KeyNotFoundException("User not found");

        mapper.Map(request, user);

        await userRepository.UpdateAsync(user);
        return Unit.Value;
    }
}
