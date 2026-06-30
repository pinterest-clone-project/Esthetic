using Application.Common.Validators;
using Application.UseCases.Users.Commands;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class AdminUnblockUserValidator : AbstractValidator<AdminUnblockUserCommand>
{
    public AdminUnblockUserValidator()
    {
        RuleFor(x => x.Id).IdRules();
    }
}