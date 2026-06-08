using Application.Mappers;
using Application.Models.DTO.Report;
using Application.UseCases.Reports.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class GetAllReportsHandler(
    IReportRepository reportRepository,
    ReportMapper reportMapper) : IRequestHandler<GetAllReportsQuery, List<ReportDTO>>
{
    public async Task<List<ReportDTO>> Handle(GetAllReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await reportRepository.GetAllAsync(cancellationToken);
        return reports.Select(reportMapper.ToDto).ToList();
    }
}