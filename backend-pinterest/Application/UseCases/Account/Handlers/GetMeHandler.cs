using Application.Common.Exceptions;
using Application.Common.Resources;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Account.Queries;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class GetMeHandler(
    UserManager<UserEntity> userManager,
    UserMapper userMapper) : IRequestHandler<GetMeQuery, UserDTO>
{
    public async Task<UserDTO> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId.ToString())
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);
        var roles = await userManager.GetRolesAsync(user);
        var dto = userMapper.ToDto(user);
        dto.Roles = roles;
        return dto;
    }
}