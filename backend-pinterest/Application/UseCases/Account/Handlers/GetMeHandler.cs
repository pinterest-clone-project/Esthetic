using Application.Common.Exceptions;
using Application.Common.Resources;
using Application.Models.DTO.User;
using Application.UseCases.Account.Queries;
using AutoMapper;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class GetMeHandler(
    UserManager<UserEntity> userManager,
    IMapper mapper)
    : IRequestHandler<GetMeQuery, UserDTO>
{
    public async Task<UserDTO> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId.ToString())
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var roles = await userManager.GetRolesAsync(user);

        var dto = mapper.Map<UserDTO>(user);
        dto.Roles = roles;

        return dto;
    }
}
