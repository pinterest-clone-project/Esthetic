using Application.Models.DTO.Report;
using Application.UseCases.Reports.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class GetAllReportsHandler(
    IReportRepository reportRepository,
    IMapper mapper) : IRequestHandler<GetAllReportsQuery, List<ReportDTO>>
{
    public async Task<List<ReportDTO>> Handle(GetAllReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await reportRepository.GetAllAsync(cancellationToken);
        return mapper.Map<List<ReportDTO>>(reports);
    }
}