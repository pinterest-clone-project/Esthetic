using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class EditCommandValidator : AbstractValidator<EditCommand>
{
    public EditCommandValidator()
    {
        RuleFor(x => x.FirstName).NameRules("Ім'я");
        RuleFor(x => x.LastName).NameRules("Прізвище");
        RuleFor(x => x.Bio).BioRules();
        RuleFor(x => x.Email).EmailRules();
        RuleFor(x => x.PhoneNumber).PhoneRules();
    }
}
