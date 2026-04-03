using Application.Common.SMTP;
using Application.Interfaces;
using Quartz;

namespace Infrastructure.Jobs;

public class SendEmailJob(ISmtpService smtpService) : IJob
{
    public const string EmailKey = "emailMessage";

    public async Task Execute(IJobExecutionContext context)
    {
        var data = context.JobDetail.JobDataMap;

        var emailModel = new EmailMessage
        {
            To = data.GetString("To")!,
            Subject = data.GetString("Subject")!,
            Body = data.GetString("Body")!
        };

        await smtpService.SendEmailAsync(emailModel);
    }
}
