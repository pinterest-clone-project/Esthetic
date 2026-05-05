using Application.Common.Validators;
using Application.UseCases.Pins.Queries;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class GetPinByIdValidator : AbstractValidator<GetPinByIdQuery>
{
    public GetPinByIdValidator()
    {
        RuleFor(x => x.Id)
            .IdRules();
    }
}
