using Application.Models.DTO.Report;
using MediatR;

namespace Application.UseCases.Reports.Queries;

public record GetAllReportsQuery : IRequest<List<ReportDTO>>;