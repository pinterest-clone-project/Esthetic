using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email є обов'язковим")
            .EmailAddress()
            .WithMessage("Невірний формат Email")
            .MaximumLength(255)
            .WithMessage("Email не може бути довшим за 255 символів");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Пароль є обов'язковим")
            .MinimumLength(6)
            .WithMessage("Пароль повинен містити мінімум 6 символів")
            .MaximumLength(100)
            .WithMessage("Пароль не може бути довшим за 100 символів");
    }
}