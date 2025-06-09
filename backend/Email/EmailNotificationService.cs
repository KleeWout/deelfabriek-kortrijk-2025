using System.Threading.Tasks;
using Deelkast.API.Models;

namespace Deelkast.API.Email
{
    public class EmailNotificationService
    {
        private readonly EmailSender _emailSender;
        private readonly string[] _adminEmails = new[] { "lisa.demeyer@kortrijk.be", "vince.boelens2005@gmail.com" };

        public EmailNotificationService()
        {
            _emailSender = new EmailSender();
        }

        public async Task SendReservationConfirmation(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.ReservationConfirmation(
                user.FirstName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.Weeks,
                reservation.PickupDeadline.ToString("dd/MM/yyyy HH:mm")
            );
            await _emailSender.SendEmailAsync(user.Email, "Reservatie voltooid bij Deelfabriek", html);
        }

        public async Task SendPickupConfirmation(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.PickupConfirmation(
                user.FirstName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.LoanStart?.ToString("dd/MM/yyyy HH:mm") ?? "-",
                $"{reservation.Weeks} week{(reservation.Weeks > 1 ? "en" : "")}",
                reservation.LoanEnd?.ToString("dd/MM/yyyy") ?? "-"
            );
            await _emailSender.SendEmailAsync(user.Email, "Je hebt je item opgehaald", html);
        }

        public async Task SendReturnReminder(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.ReturnReminder(
                user.FirstName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.LoanEnd?.ToString("dd/MM/yyyy") ?? "-"
            );
            await _emailSender.SendEmailAsync(user.Email, "Het is bijna tijd om je product terug te brengen!", html);
        }

        public async Task SendReturnConfirmation(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.ReturnConfirmation(
                user.FirstName,
                item.Title,
                reservation.PickupCode.ToString()
            );
            await _emailSender.SendEmailAsync(user.Email, "Bedankt voor het terugbrengen!", html);
        }

        public async Task SendReturnLate(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.ReturnLate(
                user.FirstName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.LoanEnd?.ToString("dd/MM/yyyy") ?? "-"
            );
            await _emailSender.SendEmailAsync(user.Email, "Item niet op tijd teruggebracht", html);
        }

        public async Task SendAdminLateNotification(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.AdminLateNotification(
                "Admin",
                user.FirstName + " " + user.LastName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.LoanEnd?.ToString("dd/MM/yyyy") ?? "-",
                reservation.Status.ToString(),
                "Niet aangevraagd"
            );
            foreach (var adminEmail in _adminEmails)
            {
                await _emailSender.SendEmailAsync(adminEmail, "Item niet teruggebracht", html);
            }
        }

        public async Task SendAdminReturnConfirmation(User user, Item item, Reservation reservation)
        {
            var html = EmailTemplates.AdminReturnConfirmation(
                "Admin",
                user.FirstName + " " + user.LastName,
                item.Title,
                reservation.PickupCode.ToString(),
                reservation.ActualReturnDate?.ToString("dd/MM/yyyy HH:mm") ?? "-",
                reservation.Status.ToString()
            );
            foreach (var adminEmail in _adminEmails)
            {
                await _emailSender.SendEmailAsync(adminEmail, "Item teruggebracht", html);
            }
        }
    }
} 