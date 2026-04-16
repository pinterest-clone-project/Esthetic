using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class EditValidator : AbstractValidator<EditCommand>
{
    public EditValidator()
    {
        RuleFor(x => x.FirstName).NameRules(ValidationMessages.FieldFirstName);
        RuleFor(x => x.LastName).NameRules(ValidationMessages.FieldLastName);
        RuleFor(x => x.Bio).BioRules();
        RuleFor(x => x.Email).EmailRules(ValidationMessages.FieldEmail);
        RuleFor(x => x.PhoneNumber).PhoneRules();
    }
}
