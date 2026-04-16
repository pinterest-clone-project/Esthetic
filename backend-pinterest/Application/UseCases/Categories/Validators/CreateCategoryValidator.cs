using Application.Common.Validators;
using Application.UseCases.Categories.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Categories.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryValidator()
    {
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
