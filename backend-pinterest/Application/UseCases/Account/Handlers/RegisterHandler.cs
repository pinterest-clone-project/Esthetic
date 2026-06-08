using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class RegisterHandler(
    UserManager<UserEntity> userManager,
    RoleManager<RoleEntity> roleManager,
    UserMapper userMapper,
    IJwtTokenService tokenService,
    IImageService imageService) : IRequestHandler<RegisterCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = userMapper.ToEntity(request);

        if (request.ImageFile != null)
            user.Image = await imageService.SaveImageAsync(request.ImageFile);

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            throw new BadRequestException(string.Join(", ", createResult.Errors.Select(e => e.Description)));

        if (!await roleManager.RoleExistsAsync(Roles.User))
            await roleManager.CreateAsync(new RoleEntity { Name = Roles.User });

        await userManager.AddToRoleAsync(user, Roles.User);
        return await tokenService.CreateTokenAsync(user);
    }
}
