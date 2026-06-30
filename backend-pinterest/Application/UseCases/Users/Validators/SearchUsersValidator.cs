using Application.UseCases.Users.Queries;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Users.Validators;

public class SearchUsersValidator : AbstractValidator<SearchUsersQuery>
{
    public SearchUsersValidator()
    {
        RuleFor(x => x.Search)
            .MaximumLength(FieldLengths.BioMax)
            .When(x => x.Search is not null);

        RuleFor(x => x.SortBy).IsInEnum();
        RuleFor(x => x.SortDirection).IsInEnum();

        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}