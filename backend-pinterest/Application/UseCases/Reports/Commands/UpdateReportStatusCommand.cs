using Domain.Enums;
using MediatR;

namespace Application.UseCases.Reports.Commands;

public record UpdateReportStatusCommand : IRequest
{
    public Guid Id { get; init; }
    public ReportStatus Status { get; init; }
}