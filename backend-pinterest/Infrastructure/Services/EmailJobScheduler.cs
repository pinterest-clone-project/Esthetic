using Application.Interfaces;
using Infrastructure.Jobs;
using Quartz;

namespace Infrastructure.Services;

public class EmailJobScheduler(ISchedulerFactory schedulerFactory) : IEmailJobScheduler
{
    public async Task ScheduleAsync(string to, string subject, string body)
    {
        var scheduler = await schedulerFactory.GetScheduler();

        var job = JobBuilder.Create<SendEmailJob>()
            .WithIdentity($"email-{Guid.NewGuid()}")
            .UsingJobData("To", to)
            .UsingJobData("Subject", subject)
            .UsingJobData("Body", body)
            .Build();

        var trigger = TriggerBuilder.Create()
            .StartNow()
            .Build();

        await scheduler.ScheduleJob(job, trigger);
    }
}
