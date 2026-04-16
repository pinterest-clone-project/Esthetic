using Application.Common.Validators;
using Application.UseCases.Categories.Commands;
using FluentValidation;

namespace Application.UseCases.Categories.Validators;

public class DeleteCategoryValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryValidator()
    {
        RuleFor(x => x.Id).IdRules();
    }
}
