using Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class DeletedPinsCleanupService(IServiceScopeFactory scopeFactory, ILogger<DeletedPinsCleanupService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IPinRepository>();
                await repo.HardDeleteExpiredAsync(stoppingToken);
                logger.LogInformation("Deleted expired pins (older than 30 days).");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during deleted pins cleanup.");
            }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
