using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class UpdatePinValidator : AbstractValidator<UpdatePinCommand>
{
    public UpdatePinValidator()
    {
        RuleFor(x => x.Id)
            .IdRules();

        RuleFor(x => x.MediaUrl)
            .UrlRules(ValidationMessages.FieldMediaUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.MediaUrl));

        RuleFor(x => x.Title)
            .NameRules(ValidationMessages.FieldTitle)
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .DescriptionRules();

        RuleFor(x => x.SourceUrl)
            .UrlRules(ValidationMessages.FieldSourceUrl);

        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage(ValidationMessages.InvalidId)
            .When(x => x.CategoryId.HasValue);

        RuleForEach(x => x.TagIds)
            .IdRules()
            .When(x => x.TagIds != null && x.TagIds.Any());
    }
}
