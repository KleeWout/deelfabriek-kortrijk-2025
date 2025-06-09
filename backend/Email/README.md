# Deelfabriek Email Notificatie Systeem

Dit systeem verstuurt automatisch e-mails naar gebruikers en beheerders bij elke stap van het uitleenproces.

## Bestanden

- `EmailSender.cs`: Stuurt e-mails via SMTP (dummy gegevens, pas aan bij echte credentials).
- `EmailTemplates.cs`: Bevat alle e-mail templates in het Nederlands.
- `EmailNotificationService.cs`: Service om alle types notificaties te versturen.

## SMTP Instellen

Pas de SMTP-instellingen aan in `EmailSender.cs` zodra de echte inloggegevens beschikbaar zijn:

```csharp
_host = "smtp.domein.be";
_port = 587;
_credentials = new NetworkCredential("deelfabriek@kortrijk.be", "JOUW_WACHTWOORD");
```

## Gebruik

Roep de juiste methode aan vanuit je backend logica:

- `SendReservationConfirmation(user, item, reservation)`
- `SendPickupConfirmation(user, item, reservation)`
- `SendReturnReminder(user, item, reservation)`
- `SendReturnConfirmation(user, item, reservation)`
- `SendReturnLate(user, item, reservation)`
- `SendAdminLateNotification(user, item, reservation)`
- `SendAdminReturnConfirmation(user, item, reservation)`

## Admin e-mails

Beheerders ontvangen een mail:

- **Als een item te laat is** (`SendAdminLateNotification`)
- **Als een item is teruggebracht** (`SendAdminReturnConfirmation`)

## Taal

Alle mails zijn volledig in het Nederlands.

## Logo

Het logo wordt geladen via een externe URL. Pas dit aan indien nodig.

---

Voor vragen, contacteer het Deelfabriek team.
