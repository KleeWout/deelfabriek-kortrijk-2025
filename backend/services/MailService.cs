using Microsoft.Extensions.Configuration;
// using System.Net;
// using System.Net.Mail;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Deelkast.API.Services;

public interface IEmailSender
{
    Task SendMailAsync(string to, string subject, string htmlBody);
}

public class MailService : IEmailSender
{
    private readonly string host;
    private readonly int port;
    private readonly string username;
    private readonly string password;
    private readonly string fromEmail;
    private readonly string fromName;
    private readonly bool enableSsl;


    public MailService(IConfiguration config)
    {
        // Create a configuration from appsettings.json
        var smtpSettings = config.GetSection("Smtp");
        host = smtpSettings["Host"];
        port = 465; // Using standard SMTP port 587 as specified in appsettings.json
        username = smtpSettings["Username"];
        password = smtpSettings["Password"];
        fromEmail = smtpSettings["FromEmail"];
        fromName = smtpSettings["FromName"];
        enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");
    }

    public async Task SendMailAsync(string to, string subject, string htmlBody)
    {
        // Create a new message
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        message.To.Add(new MailboxAddress("", to));
        message.Subject = subject;
        message.Body = new TextPart("html")
        {
            Text = htmlBody
        };
        try
        {
            Console.WriteLine("Attempting to send email...");                // Connect to SMTP server and send the email
            using (var client = new SmtpClient())
            {
                // Connect to SMTP server
                client.Connect(host, port, enableSsl);

                // Authenticate if required
                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    client.Authenticate(username, password);
                }

                // Send the message
                client.Send(message);
                client.Disconnect(true);
            }
            Console.WriteLine("Email sent successfully to wout.klee@gmail.com!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
        }


    }
}
// var mail = new MailMessage
// {
//     From = new MailAddress(fromEmail, fromName),
//     Subject = subject,
//     Body = htmlBody,
//     IsBodyHtml = true
// };

// mail.To.Add(to);

// using (var smtp = new SmtpClient(smtpHost, smtpPort))
// {
//     smtp.UseDefaultCredentials = false;
//     smtp.Credentials = new NetworkCredential(smtpUsername, smtpPassword);

//     // Port 465 uses implicit SSL/TLS
//     if (smtpPort == 465)
//     {
//         smtp.EnableSsl = true;
//         smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
//         // For implicit SSL on port 465
//         ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
//     }
//     else
//     {
//         // Standard configuration for other ports
//         smtp.EnableSsl = enableSsl;
//         smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
//     }

//     await smtp.SendMailAsync(mail);
// }
// }
