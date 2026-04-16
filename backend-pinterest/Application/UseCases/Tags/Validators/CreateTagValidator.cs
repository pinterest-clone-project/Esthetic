
using Application.Common.Validators;
using Application.UseCases.Tags.Commands;
using FluentValidation;

namespace Application.UseCases.Tags.Validators;

public class CreateTagValidator : AbstractValidator<CreateTagCommand>
{
    public CreateTagValidator()
    {
        RuleFor(x => x.Name)
            .NameRules(ValidationMessages.FieldName);
    }
}
