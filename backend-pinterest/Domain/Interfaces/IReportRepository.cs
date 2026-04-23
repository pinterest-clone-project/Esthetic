using Domain.Entities.Report;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IReportRepository : IBaseRepository<ReportEntity>
{
    Task UpdateStatusAsync(Guid id, ReportStatus status, CancellationToken ct = default);
    Task<List<ReportEntity>> GetByReporterIdAsync(Guid reporterId, CancellationToken ct = default);
}