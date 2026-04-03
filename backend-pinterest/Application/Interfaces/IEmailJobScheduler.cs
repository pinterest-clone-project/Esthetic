namespace Application.Interfaces;

public interface IEmailJobScheduler
{
    Task ScheduleAsync(string to, string subject, string body);
}