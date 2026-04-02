using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .WithMessage("Ім'я користувача є обов'язковим")
            .MaximumLength(50)
            .WithMessage("Ім'я користувача не може бути довшим за 50 символів");
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("Ім'я є обов'язковим")
            .MaximumLength(50)
            .WithMessage("Ім'я не може бути довшим за 50 символів");
        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Прізвище є обов'язковим")
            .MaximumLength(50)
            .WithMessage("Прізвище не може бути довшим за 50 символів");
        RuleFor(x => x.Bio)
            .MaximumLength(500)
            .WithMessage("Біографія не може бути довшим 500 символів");
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
            .WithMessage("Пароль не може бути довшим 100 символів");
    }
}
