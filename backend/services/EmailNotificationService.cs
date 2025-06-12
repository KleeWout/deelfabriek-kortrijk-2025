using Microsoft.Extensions.Configuration;
using Deelkast.API.Models;

namespace Deelkast.API.Services;

public interface IEmailNotificationService
{
    Task SendReservationConfirmation(User user, Item item, Reservation reservation);
    Task SendPickupConfirmation(User user, Item item, Reservation reservation);
    Task SendReturnConfirmation(User user, Item item, Reservation reservation); // bij terugbrengen
    Task SendAdminReturnConfirmation(User user, Item item, Reservation reservation);
    // ---------------------------------------
    Task SendReturnLate(User user, Item item, Reservation reservation); // als het item nog niet teruggebracht is
    Task SendAdminLateNotification(User user, Item item, Reservation reservation);
    Task SendReturnReminder(User user, Item item, Reservation reservation); // 48 uur voor terugbrengen
    Task SendAdminBlockedUserNotification(User user, Item item, Reservation reservation);
    Task SendUserBlockedNotification(User user, Item item, Reservation reservation);
    Task SendItemBackOnlineNotification(User user, Item item); // als item weer beschikbaar is 
}

public class EmailNotificationService : IEmailNotificationService
{
    private readonly MailService _mailService;
    private readonly IConfiguration _configuration;
    private readonly string _adminEmail;

    public EmailNotificationService(MailService mailService, IConfiguration configuration)
    {
        _mailService = mailService;
        _configuration = configuration;
        _adminEmail = _configuration["AdminEmail"] ?? "admin@deelkast.be";
    }

    public async Task SendReservationConfirmation(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Reservering Bevestigd - Deelkast";
            var htmlBody = EmailTemplates.GetReservationConfirmationTemplate(user, item, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);
        }
        catch (Exception ex)
        {
            // Log the error (gebruik je logging systeem)
            Console.WriteLine($"Error sending reservation confirmation email: {ex.Message}");
            throw;
        }
    }

    public async Task SendPickupConfirmation(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Item Opgehaald - Deelkast";
            var htmlBody = EmailTemplates.GetPickupConfirmationTemplate(user, item, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending pickup confirmation email: {ex.Message}");
            throw;
        }
    }



    public async Task SendReturnConfirmation(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Item Teruggebracht - Deelkast";
            var htmlBody = EmailTemplates.GetReturnConfirmationTemplate(user, item, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);

            // Ook admin notificatie sturen
            await SendAdminReturnConfirmation(user, item, reservation);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending return confirmation email: {ex.Message}");
            throw;
        }
    }

    public async Task SendReturnReminder(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Herinnering: Item Terugbrengen - Deelkast";
            var htmlBody = EmailTemplates.GetReturnReminderTemplate(user, item, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending return reminder email: {ex.Message}");
            throw;
        }
    }

    public async Task SendReturnLate(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Item Te Laat Teruggebracht - Boete Toegepast - Deelkast";
            var htmlBody = EmailTemplates.GetReturnLateTemplate(user, item, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);

            // Ook admin notificatie sturen
            await SendAdminLateNotification(user, item, reservation);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending late return email: {ex.Message}");
            throw;
        }
    }

    public async Task SendAdminLateNotification(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = $"ADMIN: Item Te Laat - {item.Title} - {user.FirstName} {user.LastName}";
            var htmlBody = EmailTemplates.GetAdminLateNotificationTemplate(user, item, reservation);

            await _mailService.SendMailAsync(_adminEmail, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending admin late notification email: {ex.Message}");
            // Don't throw here to avoid disrupting user flow
        }
    }

    public async Task SendAdminReturnConfirmation(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = $"ADMIN: Item Teruggebracht - {item.Title} - {user.FirstName} {user.LastName}";
            var htmlBody = EmailTemplates.GetAdminReturnConfirmationTemplate(user, item, reservation);

            await _mailService.SendMailAsync(_adminEmail, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending admin return confirmation email: {ex.Message}");
            // Don't throw here to avoid disrupting user flow
        }
    }

    public async Task SendAdminBlockedUserNotification(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = $"ADMIN: Gebruiker Blokkering - {user.FirstName} {user.LastName}";
            var htmlBody = EmailTemplates.GetAdminBlockedUserTemplate(user, item, reservation);

            await _mailService.SendMailAsync(_adminEmail, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending admin blocked user notification email: {ex.Message}");
            // Don't throw here to avoid disrupting user flow
        }
    }

    public async Task SendUserBlockedNotification(User user, Item item, Reservation reservation)
    {
        try
        {
            var subject = "Je account is geblokkeerd - Deelkast";
            var htmlBody = EmailTemplates.GetUserBlockedNotificationTemplate(user, reservation);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);
            await SendAdminBlockedUserNotification(user, item, reservation); // No item needed for user block notification
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending user blocked notification email: {ex.Message}");
            // Don't throw here to avoid disrupting user flow
        }
    }
    
    public async Task SendItemBackOnlineNotification(User user, Item item)
    {
        try
        {
            var subject = "Item is weer beschikbaar - Deelkast";
            var htmlBody = EmailTemplates.GetItemBackOnlineNotificationTemplate(user, item);

            await _mailService.SendMailAsync(user.Email, subject, htmlBody);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending item back online notification email: {ex.Message}");
            // Don't throw here to avoid disrupting user flow
        }
    }



}