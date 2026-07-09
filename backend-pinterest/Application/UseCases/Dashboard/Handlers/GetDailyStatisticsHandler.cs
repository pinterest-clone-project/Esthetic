using Application.UseCases.Dashboard.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Dashboard.Handlers;

public class GetDailyStatisticsHandler(
    IUserRepository userRepository,
    IPinRepository pinRepository) : IRequestHandler<GetDailyStatisticsQuery, DailyStatisticsDto>
{
    public async Task<DailyStatisticsDto> Handle(GetDailyStatisticsQuery request, CancellationToken cancellationToken)
    {
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

        var users = await userRepository.GetQueryable()
            .Where(u => u.CreatedAt >= sevenDaysAgo)
            .Select(u => new { u.CreatedAt })
            .ToListAsync(cancellationToken);

        var pins = await pinRepository.GetQueryable()
            .Where(p => p.CreatedAt >= sevenDaysAgo)
            .Select(p => new { p.CreatedAt })
            .ToListAsync(cancellationToken);

        var userCounts = users
            .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month, u.CreatedAt.Day })
            .Select(g => new DailyUserCount(
                new DateTime(g.Key.Year, g.Key.Month, g.Key.Day).ToString("yyyy-MM-dd"),
                g.Count()
            ))
            .OrderBy(x => x.Date)
            .ToList();

        var pinCounts = pins
            .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month, p.CreatedAt.Day })
            .Select(g => new DailyPinCount(
                new DateTime(g.Key.Year, g.Key.Month, g.Key.Day).ToString("yyyy-MM-dd"),
                g.Count()
            ))
            .OrderBy(x => x.Date)
            .ToList();

        return new DailyStatisticsDto(userCounts, pinCounts);
    }
}
