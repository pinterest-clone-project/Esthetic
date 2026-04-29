using Application.Models.DTO.Report;
using Application.UseCases.Reports.Commands;
using AutoMapper;
using Domain.Entities.Report;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class CreateReportHandler(
    IReportRepository reportRepository,
    IMapper mapper) : IRequestHandler<CreateReportCommand, ReportDTO>
{
    public async Task<ReportDTO> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        var report = mapper.Map<ReportEntity>(request);
        var created = await reportRepository.AddAsync(report, cancellationToken);
        return mapper.Map<ReportDTO>(created);
    }
}