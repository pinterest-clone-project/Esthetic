using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class LoginHandler(
    UserManager<UserEntity> userManager,
    IJwtTokenService tokenService)
    : IRequestHandler<LoginCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null)
            throw new UnauthorizedException("Невірний email або пароль");

        var isValidPassword = await userManager
            .CheckPasswordAsync(user, request.Password);

        if (!isValidPassword)
            throw new UnauthorizedException("Невірний email або пароль");

        await userManager.UpdateAsync(user);

        return await tokenService.CreateTokenAsync(user);
    }
}