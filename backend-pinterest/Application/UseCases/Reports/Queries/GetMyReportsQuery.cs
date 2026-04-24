using Application.Models.DTO.Report;
using MediatR;

namespace Application.UseCases.Reports.Queries;

public record GetMyReportsQuery : IRequest<List<ReportDTO>>
{
    public Guid ReporterId { get; init; }
}