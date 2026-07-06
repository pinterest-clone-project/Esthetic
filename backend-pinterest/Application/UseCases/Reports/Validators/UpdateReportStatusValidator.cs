using Application.UseCases.Reports.Commands;
using FluentValidation;

namespace Application.UseCases.Reports.Validators;

public class UpdateReportStatusValidator : AbstractValidator<UpdateReportStatusCommand>
{
    public UpdateReportStatusValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
    }
}