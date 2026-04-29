using Application.Common.Exceptions;
using Domain.Entities.Report;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories;

public class ReportRepository : BaseRepository<ReportEntity>, IReportRepository
{
    public ReportRepository(AppDbContext db) : base(db) { }

    public async Task UpdateStatusAsync(Guid id, ReportStatus status, CancellationToken ct = default)
    {
        var report = await _db.Reports.FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);

        if (report is null)
            throw new NotFoundException($"Report with id {id} not found");

        report.Status = status;
        report.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<ReportEntity>> GetByReporterIdAsync(Guid reporterId, CancellationToken ct = default)
    {
        return await _db.Reports
            .Where(r => r.ReporterId == reporterId && !r.IsDeleted)
            .Include(r => r.ReportedUser)
            .Include(r => r.ReportedPin)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);
    }
}