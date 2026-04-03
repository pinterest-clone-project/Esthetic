using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email не може бути порожнім")
            .EmailAddress()
            .WithMessage("Невірний формат email");
        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("Код підтвердження не може бути порожнім");
        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("Новий пароль не може бути порожнім")
            .MinimumLength(6)
            .WithMessage("Пароль має бути не меньше 6 символів");
    }
}
