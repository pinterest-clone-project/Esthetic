
using Application.Common.Validators;
using Application.UseCases.Tags.Commands;
using FluentValidation;

namespace Application.UseCases.Tags.Validators;

public class UpdateTagValidator : AbstractValidator<UpdateTagCommand>
{
    public UpdateTagValidator()
    {
        RuleFor(x => x.Id).IdRules();

        RuleFor(x => x.Name)
            .NameRules(ValidationMessages.FieldName);
    }
}
