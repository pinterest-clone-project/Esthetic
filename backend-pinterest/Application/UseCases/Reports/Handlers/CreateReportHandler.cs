using Application.Mappers;
using Application.Models.DTO.Report;
using Application.UseCases.Reports.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class CreateReportHandler(
    IReportRepository reportRepository,
    ReportMapper reportMapper) : IRequestHandler<CreateReportCommand, ReportDTO>
{
    public async Task<ReportDTO> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        var report = reportMapper.ToEntity(request);
        var created = await reportRepository.AddAsync(report, cancellationToken);
        return reportMapper.ToDto(created);
    }
}