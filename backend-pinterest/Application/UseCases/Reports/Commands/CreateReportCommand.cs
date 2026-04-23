using Application.Models.DTO.Report;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Reports.Commands;

public record CreateReportCommand : IRequest<ReportDTO>
{
    [BindNever]
    public Guid ReporterId { get; init; }
    public Guid? ReportedUserId { get; init; }
    public Guid? ReportedPinId { get; init; }
    public required string Reason { get; init; }
}