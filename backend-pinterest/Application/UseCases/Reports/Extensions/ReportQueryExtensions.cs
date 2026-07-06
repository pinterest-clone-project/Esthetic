using Domain.Entities.Report;
using Domain.Enums;

namespace Application.UseCases.Reports.Extensions;

public static class ReportQueryExtensions
{
    public static IQueryable<ReportEntity> ApplyStatusFilter(
        this IQueryable<ReportEntity> query, ReportStatus? status)
    {
        return status.HasValue
            ? query.Where(r => r.Status == status.Value)
            : query;
    }
}