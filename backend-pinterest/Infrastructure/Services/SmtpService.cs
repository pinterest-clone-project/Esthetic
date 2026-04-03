using Application.Common.SMTP;
using Application.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace Infrastructure.Services;

public class SmtpService : ISmtpService
{
    public async Task<bool> SendEmailAsync(EmailMessage message)
    {
        var body = new TextPart("html")
        {
            Text = message.Body
        };
        var multipart = new Multipart("mixed");
        multipart.Add(body);

        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress(EmailConfiguration.From));
        emailMessage.To.Add(new MailboxAddress(message.To));
        emailMessage.Subject = message.Subject;

        emailMessage.Body = multipart;

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(EmailConfiguration.SmtpServer, EmailConfiguration.Port, true);
            await client.AuthenticateAsync(EmailConfiguration.UserName, EmailConfiguration.Password);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error send EMAIL {0}", ex.Message);
        }
        return false;
    }
}
