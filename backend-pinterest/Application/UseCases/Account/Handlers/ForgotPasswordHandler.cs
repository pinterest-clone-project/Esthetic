using Application.Common.Emails;
using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace Application.UseCases.Account.Handlers;

public class ForgotPasswordHandler(
    IAccountRepository accountRepository,
    IEmailJobScheduler emailJobScheduler,
    UserManager<UserEntity> userManager) : IRequestHandler<ForgotPasswordCommand, Unit>
{
    public async Task<Unit> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user == null)
            throw new NotFoundException("Користувача не знайдено");

        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        var expiresAtUtc = AppTimeToLive.ResetPasswordExpiration;
        var tokenValue = $"{code}:{expiresAtUtc:o}";

        await userManager.SetAuthenticationTokenAsync(
            user,
            AuthTokenConstants.PasswordResetProvider,
            AuthTokenConstants.PasswordResetCode,
            tokenValue);

        await emailJobScheduler.ScheduleAsync(
            to: request.Email,
            subject: "Password Reset",
            body: EmailTemplates.ForgotPassword(code));

        return Unit.Value;
    }
}
