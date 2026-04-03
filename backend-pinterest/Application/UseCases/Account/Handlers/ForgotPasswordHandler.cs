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
    UserManager<UserEntity> userManager) : IRequestHandler<ForgotPasswordCommand, bool>
{
    public async Task<bool> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await accountRepository.GetByEmailAsync(request.Email);

        if (user == null)
            throw new NotFoundException("Користувача не знайдено");

        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        var expiresAtUtc = AppTimeToLive.ResetPasswordExpiration;
        var tokenValue = $"{code}:{expiresAtUtc:o}";

        await userManager.SetAuthenticationTokenAsync(
            user,
            "PasswordReset",
            "ResetCode",
            tokenValue);

        await emailJobScheduler.ScheduleAsync(
            to: request.Email,
            subject: "Password Reset",
            body: EmailTemplates.ForgotPassword(code));

        return true;
    }
}
