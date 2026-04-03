using Application.Common.SMTP;

namespace Application.Interfaces;

public interface ISmtpService
{
    Task<bool> SendEmailAsync(EmailMessage message);
}