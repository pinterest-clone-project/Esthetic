using Application.Common.Validators;
using Application.UseCases.Categories.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Categories.Validators;

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Id).IdRules();

        RuleFor(x => x.Name)
            .NameRules(ValidationMessages.FieldName);

        RuleFor(x => x.Slug)
            .SlugRules(ValidationMessages.FieldSlug);

        RuleFor(x => x.Description)
            .MaximumLength(FieldLengths.CategoryDescriptionMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldDescription, FieldLengths.CategoryDescriptionMax))
            .When(x => x.Description is not null);
    }
}
