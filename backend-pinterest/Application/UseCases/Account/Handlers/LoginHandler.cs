using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class LoginHandler(
    UserManager<UserEntity> userManager,
    IJwtTokenService tokenService,
    IAccountRepository accountRepository)
    : IRequestHandler<LoginCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user == null)
            throw new UnauthorizedException(ValidationMessages.InvalidCredentials);

        var isValidPassword = await userManager
            .CheckPasswordAsync(user, request.Password);

        if (!isValidPassword)
            throw new UnauthorizedException(ValidationMessages.InvalidCredentials);

        await userManager.UpdateAsync(user);

        return await tokenService.CreateTokenAsync(user);
    }
}