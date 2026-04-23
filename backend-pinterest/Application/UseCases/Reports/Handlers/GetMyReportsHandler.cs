using Application.Models.DTO.Report;
using Application.UseCases.Reports.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class GetMyReportsHandler(
    IReportRepository reportRepository,
    IMapper mapper) : IRequestHandler<GetMyReportsQuery, List<ReportDTO>>
{
    public async Task<List<ReportDTO>> Handle(GetMyReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await reportRepository.GetByReporterIdAsync(request.ReporterId, cancellationToken);
        return mapper.Map<List<ReportDTO>>(reports);
    }
}