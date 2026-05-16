using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class EditValidator : AbstractValidator<EditCommand>
{
    public EditValidator()
    {
        When(x => x.FirstName.HasValue && !x.FirstName.IsCleared,
            () => RuleFor(x => x.FirstName.Value).NameRules(ValidationMessages.FieldFirstName));

        When(x => x.LastName.HasValue && !x.LastName.IsCleared,
            () => RuleFor(x => x.LastName.Value).NameRules(ValidationMessages.FieldLastName));

        When(x => x.Email.HasValue && !x.Email.IsCleared,
            () => RuleFor(x => x.Email.Value).EmailRules(ValidationMessages.FieldEmail));

        When(x => x.Bio.HasValue && !x.Bio.IsCleared,
            () => RuleFor(x => x.Bio.Value).BioRules());

        When(x => x.PhoneNumber.HasValue && !x.PhoneNumber.IsCleared,
            () => RuleFor(x => x.PhoneNumber.Value).PhoneRules());
    }
}
