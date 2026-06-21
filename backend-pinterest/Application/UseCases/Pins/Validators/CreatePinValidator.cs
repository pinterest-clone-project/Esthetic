using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using FluentValidation;

namespace Application.UseCases.Pins.Validators;
public class CreatePinValidator : AbstractValidator<CreatePinCommand>
{
    public CreatePinValidator()
    {
        RuleFor(x => x)
            .Must(x => x.ImageFile != null || !string.IsNullOrWhiteSpace(x.MediaUrl))
            .WithMessage(ValidationMessages.PinImageRequired);

        RuleFor(x => x.MediaUrl)
            .UrlRules(ValidationMessages.FieldMediaUrl)
            .When(x => x.ImageFile == null && !string.IsNullOrWhiteSpace(x.MediaUrl));

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
