using Application.Common.Validators;
using Application.UseCases.Users.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Id).IdRules();

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage(ValidationMessages.EmailFormat)
            .MaximumLength(FieldLengths.EmailMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldEmail, FieldLengths.EmailMax))
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.FirstName)
            .MaximumLength(FieldLengths.NameMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldFirstName, FieldLengths.NameMax))
            .When(x => x.FirstName is not null);

        RuleFor(x => x.LastName)
            .MaximumLength(FieldLengths.NameMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldLastName, FieldLengths.NameMax))
            .When(x => x.LastName is not null);
    }
}
