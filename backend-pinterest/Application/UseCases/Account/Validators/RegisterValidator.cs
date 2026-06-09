using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.UserName).NameRules(ValidationMessages.FieldUsername);
        RuleFor(x => x.FirstName).NameRules(ValidationMessages.FieldFirstName);
        RuleFor(x => x.LastName).NameRules(ValidationMessages.FieldLastName);
        RuleFor(x => x.Bio).BioRules();
        RuleFor(x => x.Email).EmailRules(ValidationMessages.FieldEmail);
        RuleFor(x => x.Password).PasswordRules(ValidationMessages.FieldPassword);
        RuleFor(x => x.PhoneNumber).PhoneRules();
    }
}
