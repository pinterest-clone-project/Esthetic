using Application.Interfaces;
using Quartz;

namespace Infrastructure.Jobs;

public class DbSeedJob(IDbSeederService dbSeederService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        await dbSeederService.SeedData();
    }
}