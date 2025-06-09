using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Deelkast.API.Email
{
    public class EmailSender
    {
        private readonly SmtpClient _smtpClient;
        private readonly string _fromAddress = "deelfabriek@kortrijk.be";

        public EmailSender()
        {
            _smtpClient = new SmtpClient
            {
                Host = "smtp.dummy.com", // Dummy, replace later
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential("deelfabriek@kortrijk.be", "dummy-password")
            };
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var mail = new MailMessage(_fromAddress, to, subject, htmlBody)
            {
                IsBodyHtml = true
            };
            await _smtpClient.SendMailAsync(mail);
        }
    }
} 