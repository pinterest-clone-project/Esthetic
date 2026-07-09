using Application.Common.Sorting;
using Application.Common.Sorting.Report;
using Application.Models.DTO;
using Application.Models.DTO.Report;
using Domain.Enums;
using MediatR;

namespace Application.UseCases.Reports.Queries;

public record GetAllReportsQuery : IRequest<PagedResult<PinReportGroupDTO>>
{
    public ReportStatus? Status { get; init; }
    public ReportSortBy SortBy { get; init; } = ReportSortBy.CreatedAt;
    public SortDirection SortDirection { get; init; } = SortDirection.Desc;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}