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
        RuleFor(x => x.BirthDate).BirthDateRules();

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage(ValidationMessages.Required(ValidationMessages.FieldCountry))
            .MaximumLength(100).WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldCountry, 100));

        RuleFor(x => x.Language)
            .NotEmpty().WithMessage(ValidationMessages.Required(ValidationMessages.FieldLanguage))
            .MaximumLength(50).WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldLanguage, 50));

        RuleFor(x => x.CategoryIds)
            .Must(ids => ids is { Count: >= 3 })
            .WithMessage(ValidationMessages.MinItems(ValidationMessages.FieldCategoryIds, 3));  
    }
}
