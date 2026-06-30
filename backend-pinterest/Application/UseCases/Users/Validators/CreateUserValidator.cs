using Application.Common.Validators;
using Application.UseCases.Users.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.UserName)
            .IsRequired(ValidationMessages.FieldUsername)
            .MaximumLength(FieldLengths.NameMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldUsername, FieldLengths.NameMax));

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

        RuleFor(x => x.Gender)
            .IsInEnum()
            .When(x => x.Gender.HasValue);

        RuleFor(x => x.BirthDate)
            .LessThan(DateTime.UtcNow)
            .WithMessage(ValidationMessages.MustBePast(ValidationMessages.FieldBirthDate))
            .When(x => x.BirthDate.HasValue);
    }
}