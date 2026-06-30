using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Users.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Users.Handlers;

public class GetUserByIdHandler(
    IUserRepository userRepository,
    UserMapper userMapper) : IRequestHandler<GetUserByIdQuery, UserDTO>
{
    public async Task<UserDTO> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(ValidationMessages.UserNotFound);

        return userMapper.ToDto(user);
    }
}