using Application.UseCases.Reports.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Reports.Handlers;

public class UpdateReportStatusHandler(IReportRepository reportRepository)
    : IRequestHandler<UpdateReportStatusCommand>
{
    public async Task Handle(UpdateReportStatusCommand request, CancellationToken cancellationToken)
    {
        await reportRepository.UpdateStatusAsync(request.Id, request.Status, cancellationToken);
    }
}