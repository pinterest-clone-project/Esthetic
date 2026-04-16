using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using FluentValidation;

namespace Application.UseCases.Account.Validators;

public class RefreshValidator : AbstractValidator<RefreshCommand>
{
    public RefreshValidator()
    {
        RuleFor(x => x.RefreshToken).IsRequired(ValidationMessages.FieldRefreshToken);
    }
}
