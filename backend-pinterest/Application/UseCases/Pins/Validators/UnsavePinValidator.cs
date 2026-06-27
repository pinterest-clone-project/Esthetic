using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class UnsavePinValidator : AbstractValidator<UnsavePinCommand>
{
    public UnsavePinValidator()
    {
        RuleFor(x => x.PinId).IdRules();
        RuleFor(x => x.BoardId).IdRules();
    }
}
