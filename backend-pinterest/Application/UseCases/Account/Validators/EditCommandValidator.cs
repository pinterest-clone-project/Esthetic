using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class EditCommandValidator : AbstractValidator<EditCommand>
{
    public EditCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .MaximumLength(50)
            .WithMessage("Ім'я не може бути довшим за 50 символів");
        RuleFor(x => x.LastName)
            .MaximumLength(50)
            .WithMessage("Прізвище не може быть довшим за 50 символів");
        RuleFor(x => x.Bio)
            .MaximumLength(500)
            .WithMessage("Біографія не может быть довшим 500 символів");
        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("Невірний формат Email")
            .MaximumLength(255)
            .WithMessage("Email не может быть довшим за 255 символів");
        RuleFor(x => x.Password)
            .MinimumLength(6)
            .WithMessage("Пароль должен содержать минимум 6 символов")
            .MaximumLength(100)
            .WithMessage("Пароль не может быть довшим 100 символів");
    }
}
