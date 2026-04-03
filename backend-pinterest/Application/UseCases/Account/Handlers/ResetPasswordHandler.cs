using Application.Common.Exceptions;
using Application.Common.Tokens;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UseCases.Account.Handlers;

public class ResetPasswordHandler(
    IAccountRepository accountRepository,
    UserManager<UserEntity> userManager) : IRequestHandler<ResetPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new NotFoundException("Користувача не знайдено");
        }

        var rawToken = await userManager.GetAuthenticationTokenAsync(
            user,
            AuthTokenConstants.PasswordResetProvider,
            AuthTokenConstants.PasswordResetCode);

        var token = PasswordResetToken.Parse(rawToken)
            ?? throw new BadRequestException("Токен скидання паролю недійсний");

        if (!token.IsValid(request.Code))
            throw new BadRequestException("Невірний код підтвердження");

        if (token.IsExpired)
            throw new BadRequestException("Термін дії коду вийшов");

        user.PasswordHash = userManager
            .PasswordHasher.HashPassword(user, request.NewPassword);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }

        await userManager.RemoveAuthenticationTokenAsync(
            user,
            AuthTokenConstants.PasswordResetProvider,
            AuthTokenConstants.PasswordResetCode);

        return Unit.Value;

    }
}
