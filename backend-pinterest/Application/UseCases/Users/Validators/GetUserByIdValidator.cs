using Application.Common.Validators;
using Application.UseCases.Users.Queries;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class GetUserByIdValidator : AbstractValidator<GetUserByIdQuery>
{
    public GetUserByIdValidator()
    {
        RuleFor(x => x.Id).IdRules();
    }
}