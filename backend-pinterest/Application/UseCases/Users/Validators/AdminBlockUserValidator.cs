using Application.Common.Validators;
using Application.UseCases.Users.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class BlockUserValidator : AbstractValidator<AdminBlockUserCommand>
{
    public BlockUserValidator()
    {
        RuleFor(x => x.Id).IdRules();

        RuleFor(x => x.Reason)
            .IsRequired(ValidationMessages.FieldBlockReason)
            .MaximumLength(FieldLengths.BlockReasonMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldBlockReason, FieldLengths.BlockReasonMax));
    }
}
