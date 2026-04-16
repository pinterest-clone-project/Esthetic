
using Application.Common.Validators;
using Application.UseCases.Tags.Queries;
using FluentValidation;

namespace Application.UseCases.Tags.Validators;

public class GetTagByIdValidator : AbstractValidator<GetTagByIdQuery>
{
    public GetTagByIdValidator()
    {
        RuleFor(x => x.id).IdRules();
    }
}
