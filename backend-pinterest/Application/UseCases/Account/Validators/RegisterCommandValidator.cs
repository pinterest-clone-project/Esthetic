using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Username).NameRules("Ім'я користувача");
        RuleFor(x => x.FirstName).NameRules("Ім'я");
        RuleFor(x => x.LastName).NameRules("Прізвище");
        RuleFor(x => x.Bio).BioRules();
        RuleFor(x => x.Email).EmailRules();
        RuleFor(x => x.Password).PasswordRules();
        RuleFor(x => x.PhoneNumber).PhoneRules();
    }
}
