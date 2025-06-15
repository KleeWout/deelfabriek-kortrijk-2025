using Deelkast.API.Models;

namespace Deelkast.API.Services;

public static class EmailTemplates
{
    private const string LogoBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgaWQ9IkxhYWdfMSIgZGF0YS1uYW1lPSJMYWFnIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ4Ni45MSA4MC41MSI+DQogIDxkZWZzPg0KICAgIDxzdHlsZT4NCiAgICAgIC5jbHMtMSB7DQogICAgICAgIGZpbGw6ICNmZmY7DQogICAgICB9DQoNCiAgICAgIC5jbHMtMSwgLmNscy0yIHsNCiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7DQogICAgICB9DQoNCiAgICAgIC5jbHMtMiB7DQogICAgICAgIGZpbGw6ICMwMDRjNGI7DQogICAgICB9DQogICAgPC9zdHlsZT4NCiAgPC9kZWZzPg0KICA8cmVjdCBjbGFzcz0iY2xzLTIiIHdpZHRoPSI0ODYuOTEiIGhlaWdodD0iODAuNTEiLz4NCiAgPGc+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtNjQuOTgsNDAuNjdjMCwyMi42OC02LjYzLDI5LjA2LTI1LjMsMjkuMDYtOSwwLTE2LjM3LS4zMy0yMy4xNy0uODJWMTIuNDNjNi44OC0uNDEsMTQtLjgyLDIzLjE3LS44MiwxOC42NywwLDI1LjMsNi4zOSwyNS4zLDI5LjA2Wm0tMTYuMjEsMGMwLTEzLjkyLTEuOTYtMTcuNi05LjA5LTE3LjZoLTcuNzh2MzUuMDRjMi4zNy4wOCw0Ljk5LjA4LDcuNzguMDgsNy4xMiwwLDkuMDktMy42LDkuMDktMTcuNTJaIi8+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTEwLjY2LDU3LjM3bDEuMzEsOS4wOWMtNS4zMiwyLjctMTIuMjgsMy40NC0xOC45MSwzLjQ0LTE2LjI5LDAtMjIuMjctNi43OS0yMi4yNy0yMS4xMiwwLTE2LjA1LDYuMTQtMjEuNjksMjIuMDItMjEuNjksMTQuNjUsMCwyMC4yMiw0LjkxLDIwLjMsMTQuNDEuMDgsNy40NS0zLjY4LDEwLjk3LTE0LjI0LDEwLjk3aC0xMi4yYy42Niw0LjU4LDIuNzgsNS44OSw4LjAyLDUuODksMy41MiwwLDkuNTgtLjI1LDE1Ljk2LS45OFptLTI0LjIzLTEyLjYxaDguMjdjMy41MiwwLDQuMDktMS4wNiw0LjA5LTMuNiwwLTMuMTktMS40Ny00LjAxLTUuNTctNC4wMS00Ljk5LS4wOC02LjU1LDEuMDYtNi43OSw3LjYxWiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE1Ny44Miw1Ny4zN2wxLjMxLDkuMDljLTUuMzIsMi43LTEyLjI4LDMuNDQtMTguOTEsMy40NC0xNi4yOSwwLTIyLjI3LTYuNzktMjIuMjctMjEuMTIsMC0xNi4wNSw2LjE0LTIxLjY5LDIyLjAyLTIxLjY5LDE0LjY1LDAsMjAuMjIsNC45MSwyMC4zLDE0LjQxLjA4LDcuNDUtMy42OCwxMC45Ny0xNC4yNCwxMC45N2gtMTIuMmMuNjYsNC41OCwyLjc4LDUuODksOC4wMiw1Ljg5LDMuNTIsMCw5LjU4LS4yNSwxNS45Ni0uOThabS0yNC4yMy0xMi42MWg4LjI3YzMuNTIsMCw0LjA5LTEuMDYsNC4wOS0zLjYsMC0zLjE5LTEuNDctNC4wMS01LjU3LTQuMDEtNC45OS0uMDgtNi41NSwxLjA2LTYuNzksNy42MVoiLz4NCiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xODEuNTYsNTQuNzVjMCwyLjQ2LDEuMzksMy41Miw0LjM0LDMuNTJoMi45NWwxLjcyLDkuODJjLTIuMjksMS4zMS04LjAyLDEuODgtMTAuOTcsMS44OC03Ljk0LDAtMTIuODUtNC4xNy0xMi44NS0xMS4zVjExLjYxaDE0LjgydjQzLjE0WiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTIxMi44MywyNC43OXYzLjQ0aDEwLjMxdjkuMzNoLTEwLjMxdjMxLjM1aC0xNC45OHYtMzEuMzVoLTYuOTZ2LTguOTJsNi45Ni0uNDF2LTUuNDhjMC03LjYxLDMuNjgtMTIuOTMsMTQuMjQtMTIuOTMsMy4xMSwwLDEwLjIzLjI1LDE0LjA4Ljk4bC0xLjM5LDkuMjVoLTcuMzdjLTMuNTIsMC00LjU4LDEuMjMtNC41OCw0Ljc1WiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTI2Ny4zNiw0Mi45NnYyNS45NWgtMTEuNzlsLTEuMzktNS45OGMtMi43OCwzLjQ0LTcuNDUsNy4wNC0xNC40OSw3LjA0LTcuNjEsMC0xMy42Ny00LjAxLTEzLjY3LTExLjYydi00LjA5YzAtNi40Nyw0LjkxLTEwLjQsMTMuMDItMTAuNGgxMy41MXYtLjk4Yy0uMDgtMy40NC0xLjM5LTQuNjctNS42NS00LjY3cy0xMC42NC4xNi0xNy40NC41N2wtMS4zMS05LjY2YzYuMDYtMS4xNSwxNi4yOS0yLjA1LDIyLjI3LTIuMDUsMTAuOTcsMCwxNi45NSwzLjc3LDE2Ljk1LDE1Ljg4Wm0tMjIuNzYsMTYuNTRjMi4zNywwLDUuMjQtMS4wNiw3Ljk0LTIuODd2LTQuOTloLTguNTFjLTIuNDYuMDgtMy40NCwxLjMxLTMuNDQsMy4xOXYxLjM5YzAsMi4xMywxLjIzLDMuMjcsNC4wMSwzLjI3WiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTMxOC4xMSw0OC4xMmMwLDExLjcxLTMuNTIsMjEuNzgtMjEuMDQsMjEuNzgtNS44MSwwLTE2Ljk1LS45OC0yMS43OC0zLjI3VjExLjYxaDE0LjlsLjA4LDEyLjAzYy4wOCwzLjI3LS4yNSw2LjYzLTEuMTUsOS42NiwzLjYtMy41Miw4LjUxLTYuMjIsMTMuNzUtNi4yMiwxMS4wNSwwLDE1LjIzLDYuMDYsMTUuMjMsMjEuMDRabS0xNS4zMS4wOGMwLTcuNzgtMS4xNS05LjY2LTUuOTgtOS42Ni0yLjcsMC00LjUuOS02LjcxLDIuMDVsLjA4LDE4LjQyYzIuMjEuNDEsNC45MS41Nyw2LjYzLjQ5LDQuNDItLjE2LDUuOTgtMi4zNyw1Ljk4LTExLjNaIi8+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMzU2LjM1LDI3LjA4bC0xLjMxLDEzLjY3aC0zLjkzYy0yLjk1LDAtNi4xNC40OS0xMS4yMiwxLjcydjI2LjQ0aC0xNC45VjI4LjIzaDExLjYybDEuMzEsNS45OGM1LjMyLTQuNzUsMTAuODktNy4xMiwxNi4yMS03LjEyaDIuMjFaIi8+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMzc2LjI0LDE0LjMxdjQuMjZjMCwyLjk1LTEuMzksNC4zNC00LjI2LDQuMzRoLTYuNDdjLTIuODcsMC00LjM0LTEuMzktNC4zNC00LjM0di00LjI2YzAtMi45NSwxLjQ3LTQuNDIsNC4zNC00LjQyaDYuNDdjMi44NywwLDQuMjYsMS40Nyw0LjI2LDQuNDJabS0uMDgsNTQuNmgtMTQuODJWMjguMjNoMTQuODJ2NDAuNjlaIi8+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtNDIzLjE1LDU3LjM3bDEuMzEsOS4wOWMtNS4zMiwyLjctMTIuMjgsMy40NC0xOC45MSwzLjQ0LTE2LjI5LDAtMjIuMjctNi43OS0yMi4yNy0yMS4xMiwwLTE2LjA1LDYuMTQtMjEuNjksMjIuMDItMjEuNjksMTQuNjUsMCwyMC4yMiw0LjkxLDIwLjMsMTQuNDEuMDgsNy40NS0zLjY4LDEwLjk3LTE0LjI0LDEwLjk3aC0xMi4yYy42Niw0LjU4LDIuNzgsNS44OSw4LjAyLDUuODksMy41MiwwLDkuNTgtLjI1LDE1Ljk2LS45OFptLTI0LjIzLTEyLjYxaDguMjdjMy41MiwwLDQuMDktMS4wNiw0LjA5LTMuNiwwLTMuMTktMS40Ny00LjAxLTUuNTctNC4wMS00Ljk5LS4wOC02LjU1LDEuMDYtNi43OSw3LjYxWiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTQ0OS4yNiw1MC43NGgtMi45NWMuMzMsMi4xMy41Nyw0LjI2LjU3LDYuMDZ2MTIuMTJoLTE0LjlWMTEuNjFoMTQuOXYyMi43NmMwLDIuNTQtLjE2LDUuMTYtLjU3LDcuN2gzLjAzbDguNzYtMTMuODNoMTYuMzdsLTkuNDEsMTMuNjdjLTEuMTUsMS45Ni0zLjE5LDMuNzctNC4yNiw0LjQydi4zM2MxLjA2LjU3LDMuMTEsMi44Niw0LjI2LDQuOTFsMTAuODksMTcuMzVoLTE2LjQ2bC0xMC4yMy0xOC4xN1oiLz4NCiAgPC9nPg0KPC9zdmc+";

    // Helper method to convert file to base64 (call this once to get your base64 string)


    private static string GetBaseTemplate(string title, string content, string titleColor = "#004431")
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{title}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .logo {{ max-width: 200px; height: auto; }}
        .title {{ font-size: 24px; margin: 20px 0; }}
        .content {{ color: #555; line-height: 1.6; }}
        .highlight {{ background-color:#f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px; text-align: center; }}
        .button {{ display: inline-block; background-color: #004431; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 15px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='{LogoBase64}' alt='Deelkast Logo' class='logo'>
            <h1 class='title' style='color: {titleColor};'>{title}</h1>
        </div>
        <div class='content'>
            {content}
        </div>
        <div class='footer'>
            <p>Dit is een automatisch gegenereerde e-mail van Deelkast.<br></p>
        </div>
    </div>
</body>
</html>";
    }
    public static string GetReservationConfirmationTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
            <div style='font-size: 2em; font-weight: bold; color: #004431; margin-bottom: 20px; text-align: center;'>
                {reservation.PickupCode}
            </div>
            <p>Je reservering is bevestigd! Hier zijn de details:</p>
            <div class='highlight'>
                <strong>Reservering Details:</strong><br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>Ophalen voor:</strong> {reservation.PickupDeadline:dd/MM/yyyy HH:mm}<br>
                <strong>Aantal weken:</strong> {reservation.Weeks}<br>
                <strong>Totaalprijs:</strong> €{reservation.TotalPrice:F2}
            </div>
            <p>Je hebt <strong>3 dagen</strong> de tijd om je item op te halen. Ophalen kan via het Deelfabriek tablet. Voer de bovenste reservatiecode in om het betalingsproces te starten.</p>
            <div class='highlight' style='background-color:#FEF3C7;'>
            <p><strong>Indien je het item niet binnen de 3 dagen komt ophalen, wordt je reservatie automatisch geannuleerd en komt het item opnieuw beschikbaar voor anderen.</strong></p>
            </div>
            <p>Bedankt voor het gebruik van Deelkast!</p>";

        return GetBaseTemplate("Reservatie Voltooid!", content, "#004431");
    }

    public static string GetPickupConfirmationTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
        <div style='font-size: 2em; font-weight: bold; color: #004431; margin-bottom: 20px; text-align: center;'>
                {reservation.PickupCode}
            </div>
            <p>Dag {user.FirstName} {user.LastName},</p>
            
            <p>Je item is succesvol opgehaald!</p>
            
            <div class='highlight'>
                <strong>Uitlening Details:</strong><br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>reservatiecode:</strong> {reservation.LoanStart:dd/MM/yyyy HH:mm}<br>
                <strong>Teruggave datum:</strong> {reservation.LoanEnd:dd/MM/yyyy HH:mm}<br>
                <strong>Aantal weken:</strong> {reservation.Weeks}<br>
                <strong>Betaald bedrag:</strong> €{reservation.TotalPrice:F2}
            </div>
            
            <div class='highlight' style='background-color:#FEF3C7;'>
            <p><strong>Bij het terugbrengen, kies je op de tablet voor 'Retourneren', geef je reservatiecode in en het juiste kastje zal automatisch openen. Plaats het item terug en sluit het kastje goed.</strong></p>
            </div>

            <p><strong>Herinnering:</strong> Breng het item terug voor {reservation.LoanEnd:dd/MM/yyyy} om extra kosten te voorkomen.</p>

            
            <p>Veel plezier met je item!</p>";

        return GetBaseTemplate("Je hebt je item opgehaald", content, "#004431");
    }

    public static string GetReturnReminderTemplate(User user, Item item, Reservation reservation)
    {
        var daysLeft = Math.Max(0, (reservation.LoanEnd!.Value.Date - DateTime.Now.Date).Days);

        var content = $@"
            <p>Dag {user.FirstName} {user.LastName},</p>
            
            <p>Een vriendelijke herinnering: de terugbrengdatum van het onderstaande item komt dichterbij.</p>
            
            <div class='highlight'>
                <strong>Item Details:</strong><br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>Teruggave datum:</strong> {reservation.LoanEnd:dd/MM/yyyy}<br>
                <strong>Dagen resterend:</strong> {daysLeft}
            </div>
            
            <p>Je kunt het item terugbrengen via de kiosk met behulp van je reservatiecode: <strong>{reservation.PickupCode}</strong>.</p>
            
            <p><strong>Belangrijk:</strong> Voor elke dag dat het item te laat wordt ingeleverd, wordt een boete van €0.50 in rekening gebracht. Breng het dus op tijd terug om extra kosten te voorkomen.</p>";

        return GetBaseTemplate("Herinnering: Item Terugbrengen", content, "#004431");
    }

    public static string GetReturnConfirmationTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
            <p>Dag {user.FirstName} {user.LastName},</p>
            
            <p>Bedankt! Je item is succesvol teruggebracht.</p>
            
            <div class='highlight'>
                <strong>Teruggave Details:</strong><br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>Teruggave datum:</strong> {reservation.ActualReturnDate:dd/MM/yyyy HH:mm}<br>
                <strong>Geplande teruggave:</strong> {reservation.LoanEnd:dd/MM/yyyy}<br>
                <strong>Uitleenperiode:</strong> {reservation.Weeks} weken
            </div>
            
            <p>We hopen dat je tevreden bent met je ervaring. Je kunt altijd weer een nieuw item reserveren!</p>
            
            <p>Bedankt voor het gebruik van Deelkast!</p>";

        return GetBaseTemplate("Item Teruggebracht", content, "#004431");
    }

    public static string GetReturnLateTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
        <p>Dag {user.FirstName} {user.LastName},</p>
        
        <p>Volgens onze gegevens is het onderstaande item niet teruggebracht. Hierdoor zijn er extra kosten in rekening gebracht.</p>
        
        <div class='highlight'>
            <strong>Item:</strong> {item.Title}<br>
            <strong>reservatiecode:</strong> {reservation.PickupCode}<br>
            <strong>Geplande inleverdatum:</strong> {reservation.LoanEnd:dd/MM/yyyy}<br>
        </div>
        
        <p>We vragen je vriendelijk om het item zo snel mogelijk terug te brengen. Voor elke dag vertraging wordt een toeslag van €0,50 aangerekend, te betalen aan het deelkast tablet.</p>
        
        <p>Let op: zodra het totaalbedrag aan boetes de €7,00 overschrijdt, kan je account tijdelijk worden geblokkeerd. Neem in dat geval contact op met een medewerker voor verdere hulp.</p>
        
        <p>Bedankt voor je aandacht. Probeer in de toekomst items tijdig terug te brengen om extra kosten en ongemakken te vermijden.</p>";

        return GetBaseTemplate("Item niet teruggebracht", content, "#b30000");
    }


    public static string GetAdminLateNotificationTemplate(User user, Item item, Reservation reservation)
    {

        var content = $@"
            <p>Beste beheerder,</p>
            
            <p>Een item is niet teruggebracht door een gebruiker.</p>
            
            <div class='highlight'>
                <strong>Details:</strong><br>
                <strong>Gebruiker:</strong> {user.FirstName} {user.LastName} ({user.Email})<br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>Geplande teruggave:</strong> {reservation.LoanEnd:dd/MM/yyyy}<br>
            </div>
            
             <p>De gebruiker is op de hoogte gebracht via e-mail, en de boete is automatisch aan zijn/haar account toegevoegd.</p>";

        return GetBaseTemplate("Item Niet Teruggebracht", content, "#b30000");
    }

    public static string GetAdminReturnConfirmationTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
            <p>Beste beheerder,</p>
            
            <p>Een item is succesvol teruggebracht door een gebruiker.</p>
            
            <div class='highlight'>
                <strong>Details:</strong><br>
                <strong>Gebruiker:</strong> {user.FirstName} {user.LastName} ({user.Email})<br>
                <strong>Item:</strong> {item.Title}<br>
                <strong>Teruggave datum:</strong> {reservation.ActualReturnDate:dd/MM/yyyy HH:mm}<br>
                <strong>Uitleenperiode:</strong> {reservation.Weeks} weken<br>
            </div>
            
            <p>Het item is weer beschikbaar voor reservering.</p>";

        return GetBaseTemplate("Item Teruggebracht", content, "#004431");
    }


    public static string GetAdminBlockedUserTemplate(User user, Item item, Reservation reservation)
    {
        var content = $@"
        <p>Beste beheerder,</p>
        
        <p>Een gebruiker heeft het boetelimit van €7,00 overschreden en is automatisch geblokkeerd.</p>
        
        <div class='highlight'>
            <strong>Gebruiker:</strong> {user.FirstName} {user.LastName} ({user.Email})<br>
            <strong>Item:</strong> {item.Title}<br>
            <strong>Geplande inleverdatum:</strong> {reservation.LoanEnd:dd/MM/yyyy}<br>
            <strong>Openstaande boete:</strong> €{reservation.FineApplied:F2}<br>
        </div>
        
        <p>De gebruiker werd eerder verwittigd over de laattijdige teruggave. Aangezien de boete het ingestelde limiet heeft overschreden, is het account nu tijdelijk gedeactiveerd.</p>

        <p>Voor verdere opvolging of uitzonderingen kun je manueel tussenkomen via het beheerpaneel.</p>";

        return GetBaseTemplate("Gebruiker geblokkeerd wegens boeteoverschrijding", content, "#cc0000");
    }

    public static string GetUserBlockedNotificationTemplate(User user, Reservation reservation)
    {
        var content = $@"
            <p>Dag {user.FirstName} {user.LastName},</p>
            
            <p>Je account is tijdelijk gedeactiveerd omdat het totaalbedrag aan openstaande boetes €{reservation.FineApplied:F2} bedraagt. Het ingestelde limiet is €7,00.</p>
            
            <p>Om je account opnieuw te activeren, vragen we je vriendelijk om contact op te nemen met een medewerker. We bekijken dan samen de mogelijkheden voor verdere opvolging.</p>
            
            <p>We raden aan om in de toekomst items tijdig terug te brengen om extra kosten en beperkingen te vermijden.</p>
            
            <p>Bedankt voor je begrip.</p>";

        return GetBaseTemplate("Account geblokkeerd", content, "#cc0000");
    }
    public static string GetItemBackOnlineNotificationTemplate(User user, Item item)
        {
            var content = $@"
                <p>Dag {user.FirstName} {user.LastName},</p>

                <p>Goed nieuws! Het item <strong>{item.Title}</strong> is opnieuw beschikbaar in Deelkast.</p>

                <div class='highlight'>
                    <strong>Item:</strong> {item.Title}<br>
                    <strong>Prijs per week:</strong> €{item.PricePerWeek:F2}
                </div>

                <p>Indien er meerdere gebruikers een melding hebben ingesteld voor dit item, raden we aan om snel te reserveren indien je het nodig hebt.</p>";

            return GetBaseTemplate("Het item is opnieuw beschikbaar!", content, "#004431");
        }



}