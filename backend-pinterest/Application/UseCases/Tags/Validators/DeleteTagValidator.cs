

using Application.Common.Validators;
using Application.UseCases.Tags.Commands;
using FluentValidation;

namespace Application.UseCases.Tags.Validators;

public class DeleteTagValidator : AbstractValidator<DeleteTagCommand>
{
    public DeleteTagValidator()
    {
        RuleFor(x => x.id).IdRules();
    }
}
