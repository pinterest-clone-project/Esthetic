using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email).EmailRules(ValidationMessages.FieldEmail);
        RuleFor(x => x.Code).IsRequired(ValidationMessages.FieldCode);
        RuleFor(x => x.NewPassword).PasswordRules(ValidationMessages.FieldNewPassword);
    }
}
