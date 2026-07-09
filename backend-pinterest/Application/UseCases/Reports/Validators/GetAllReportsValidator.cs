using Application.UseCases.Reports.Queries;
using FluentValidation;

namespace Application.UseCases.Reports.Validators;

public class GetAllReportsValidator : AbstractValidator<GetAllReportsQuery>
{
    public GetAllReportsValidator()
    {
        RuleFor(x => x.Status).IsInEnum().When(x => x.Status.HasValue);
        RuleFor(x => x.SortBy).IsInEnum();
        RuleFor(x => x.SortDirection).IsInEnum();

        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
