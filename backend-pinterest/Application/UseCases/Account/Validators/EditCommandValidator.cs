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
            .WithMessage("Прізвище не може бути довшим за 50 символів");
        RuleFor(x => x.Bio)
            .MaximumLength(500)
            .WithMessage("Біографія не може бути довшим 500 символів");
        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("Невірний формат Email")
            .MaximumLength(255)
            .WithMessage("Email не може бути довшим за 255 символів");
        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[0-9\s\-\(\)]{7,20}$")
            .WithMessage("Невірний формат номера телефону")
            .MaximumLength(20)
            .WithMessage("Номер телефону не може бути довшим 20 символів")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
    }
}
