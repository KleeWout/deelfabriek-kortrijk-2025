using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Deelkast.API.Services;

public interface IEmailSender
{
    Task SendMailAsync(string to, string subject, string htmlBody);
}

public class MailService
{
    private readonly string smtpHost;
    private readonly int smtpPort;
    private readonly string smtpUsername;
    private readonly string smtpPassword;
    private readonly string fromEmail;
    private readonly string fromName;

    public MailService(IConfiguration config)
    {
        smtpHost = config["Smtp:Host"];
        smtpPort = int.Parse(config["Smtp:Port"]);
        smtpUsername = config["Smtp:Username"];
        smtpPassword = config["Smtp:Password"];
        fromEmail = config["Smtp:FromEmail"];
        fromName = config["Smtp:FromName"];
    }

    public async Task SendMailAsync(string to, string subject, string htmlBody)
    {
        var mail = new MailMessage
        {
            From = new MailAddress(fromEmail, fromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        mail.To.Add(to);

        using var smtp = new SmtpClient(smtpHost, smtpPort)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(smtpUsername, smtpPassword)
        };

        await smtp.SendMailAsync(mail);
    }
}
