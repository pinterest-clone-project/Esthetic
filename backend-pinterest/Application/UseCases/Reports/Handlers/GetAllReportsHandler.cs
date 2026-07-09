using Application.Common.Sorting;
using Application.Common.Sorting.Report;
using Application.Models.DTO;
using Application.Models.DTO.Report;
using Application.UseCases.Reports.Extensions;
using Application.UseCases.Reports.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Reports.Handlers;

public class GetAllReportsHandler(IReportRepository reportRepository)
    : IRequestHandler<GetAllReportsQuery, PagedResult<PinReportGroupDTO>>
{
    public async Task<PagedResult<PinReportGroupDTO>> Handle(
        GetAllReportsQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = reportRepository.GetQueryable()
            .Where(r => r.ReportedPinId != null)
            .ApplyStatusFilter(request.Status);

        var groupedQuery = baseQuery
            .GroupBy(r => r.ReportedPinId!.Value)
            .Select(g => new
            {
                PinId = g.Key,
                ReportsCount = g.Count(),
                LatestReportAt = g.Max(r => r.CreatedAt),
                PinImage = g.Select(r => r.ReportedPin!.Image).First(),
                PinCreatorId = g.Select(r => r.ReportedPin!.CreatorId).First(),
                PinCreatorUserName = g.Select(r => r.ReportedPin!.Creator!.UserName).First(),
                Reports = g.OrderByDescending(r => r.CreatedAt)
                    .Select(r => new
                    {
                        r.Id,
                        r.ReporterId,
                        ReporterUserName = r.Reporter!.UserName,
                        r.ReportedUserId,
                        r.ReportedPinId,
                        r.Reason,
                        r.Status,
                        r.CreatedAt
                    }).ToList()
            });

        groupedQuery = request.SortBy switch
        {
            ReportSortBy.ReportsCount => request.SortDirection == SortDirection.Asc
                ? groupedQuery.OrderBy(g => g.ReportsCount)
                : groupedQuery.OrderByDescending(g => g.ReportsCount),
            _ => request.SortDirection == SortDirection.Asc
                ? groupedQuery.OrderBy(g => g.LatestReportAt)
                : groupedQuery.OrderByDescending(g => g.LatestReportAt)
        };

        var totalCount = await groupedQuery.CountAsync(cancellationToken);

        var pageItems = await groupedQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var items = pageItems.Select(g => new PinReportGroupDTO
        {
            PinId = g.PinId,
            PinImage = g.PinImage,
            PinCreatorId = g.PinCreatorId,
            PinCreatorUserName = g.PinCreatorUserName,
            ReportsCount = g.ReportsCount,
            LatestReportAt = g.LatestReportAt,
            Reports = g.Reports.Select(r => new ReportDTO
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterUserName = r.ReporterUserName,
                ReportedUserId = r.ReportedUserId,
                ReportedPinId = r.ReportedPinId,
                Reason = r.Reason,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt
            }).ToList()
        }).ToList();

        return new PagedResult<PinReportGroupDTO>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
