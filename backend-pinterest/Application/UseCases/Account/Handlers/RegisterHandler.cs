using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using AutoMapper;
using Domain.Constants;
using Domain.Entities.Identity;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class RegisterHandler(
    UserManager<UserEntity> userManager,
    RoleManager<RoleEntity> roleManager,
    IMapper mapper,
    IJwtTokenService tokenService,
    IImageService imageService
    ) : IRequestHandler<RegisterCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<UserEntity>(request);

        if (request.ImageFile != null)
        {
            user.Image = await imageService.SaveImageAsync(request.ImageFile);
        }

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }

        if (!await roleManager.RoleExistsAsync(Roles.User))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = Roles.User });
        }

        await userManager.AddToRoleAsync(user, Roles.User);

        return await tokenService.CreateTokenAsync(user);
    }
}