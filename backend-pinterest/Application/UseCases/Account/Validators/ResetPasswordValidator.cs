using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email).EmailRules("Email");
        RuleFor(x => x.Code).IsRequired("Код");
        RuleFor(x => x.NewPassword).PasswordRules("Новий пароль");
    }
}
