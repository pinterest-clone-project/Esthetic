using Application.Common.Validators;
using Application.UseCases.Categories.Queries;
using FluentValidation;

namespace Application.UseCases.Categories.Validators;

public class GetCategoryByIdValidator : AbstractValidator<GetCategoryByIdQuery>
{
    public GetCategoryByIdValidator()
    {
        RuleFor(x => x.Id).IdRules();
    }
}
