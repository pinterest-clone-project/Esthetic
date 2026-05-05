using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class DeletePinValidator : AbstractValidator<DeletePinCommand>
{
    public DeletePinValidator()
    {
        RuleFor(x => x.Id)
            .IdRules();
    }
}
