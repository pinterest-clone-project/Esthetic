using Application.Common.Validators;
using Application.UseCases.Users.Commands;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class DeleteUserValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserValidator()
    {
        RuleFor(x => x.Id).IdRules();
    }
}