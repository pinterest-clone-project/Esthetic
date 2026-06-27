using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class SavePinValidator : AbstractValidator<SavePinCommand>
{
    public SavePinValidator()
    {
        RuleFor(x => x.PinId).IdRules();
        RuleFor(x => x.BoardId).IdRules();
    }
}
