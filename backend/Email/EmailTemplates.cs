namespace Deelkast.API.Email
{
    public static class EmailTemplates
    {
        public static string ReservationConfirmation(
            string userName, string itemName, string reservationCode, int weeks, string pickupDeadline)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#008a4e;margin-bottom:8px;'>Reservatie voltooid!</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Je hebt het item <b>{itemName}</b> gereserveerd.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Reservatiecode:</b> <span style='font-size:1.4rem;color:#005c3c;font-weight:bold;'>{reservationCode}</span></div>
            <div><b>Periode:</b> {weeks} week{(weeks > 1 ? "en" : "")}</div>
            <div><b>Ophalen voor:</b> {pickupDeadline}</div>
        </div>
        <div style='background:#fffbe6;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#665c00;border:1px solid #ffe58f;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>⚠️</span>
            <span>Haal je item op binnen 48 uur. Daarna vervalt je reservatie en komt het item opnieuw vrij.</span>
        </div>
        <div style='font-size:1.05rem;color:#333;margin:18px auto 0 auto;max-width:420px;'>
            Ga naar de Deelfabriek, vul je code in op de tablet, betaal met Payconiq en haal je item op.
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Veel plezier met je item!<br>Het Deelfabriek team</div>
    </div>
    ";
        }

        public static string PickupConfirmation(
            string userName, string itemName, string reservationCode, string pickupDate, string usagePeriod, string returnDate)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#008a4e;margin-bottom:8px;'>Je hebt je item opgehaald</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Hi {userName}, je hebt het item <b>{itemName}</b> opgehaald.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Reservatiecode:</b> <span style='font-size:1.4rem;color:#005c3c;font-weight:bold;'>{reservationCode}</span></div>
            <div><b>Ophaaldatum:</b> {pickupDate}</div>
            <div><b>Periode:</b> {usagePeriod}</div>
            <div><b>Terugbrengen voor:</b> {returnDate}</div>
        </div>
        <div style='background:#fffbe6;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#665c00;border:1px solid #ffe58f;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>ℹ️</span>
            <span>Wil je het item terugbrengen? Ga naar de Deelfabriek, vul je code in op de tablet en volg de stappen.</span>
        </div>
        <div style='background:#ffeaea;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#a94442;border:1px solid #ffb3b3;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>⏳</span>
            <span>Verlengen is niet mogelijk.</span>
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Veel plezier met je item!<br>Het Deelfabriek team</div>
    </div>
    ";
        }

        public static string ReturnReminder(
            string userName, string itemName, string reservationCode, string returnDate)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#e6a100;margin-bottom:8px;'>Bijna tijd om terug te brengen</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Beste {userName}, je uitleentermijn voor <b>{itemName}</b> loopt bijna af.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Reservatiecode:</b> <span style='font-size:1.4rem;color:#005c3c;font-weight:bold;'>{reservationCode}</span></div>
            <div><b>Terugbrengen voor:</b> {returnDate}</div>
        </div>
        <div style='background:#fffbe6;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#665c00;border:1px solid #ffe58f;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>⚠️</span>
            <span>Ben je te laat? Dan betaal je 1 euro per dag. Vanaf 7 euro wordt je code geblokkeerd.</span>
        </div>
        <div style='font-size:1.05rem;color:#333;margin:18px auto 0 auto;max-width:420px;'>
            Breng het item terug via de tablet in Deelfabriek. Volg de stappen op het scherm.
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Bedankt om te delen!<br>Het Deelfabriek team</div>
    </div>
    ";
        }

        public static string ReturnConfirmation(
            string userName, string itemName, string reservationCode)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#008a4e;margin-bottom:8px;'>Bedankt voor het terugbrengen!</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Beste {userName}, je hebt het item <b>{itemName}</b> correct teruggebracht.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Reservatiecode:</b> <span style='font-size:1.4rem;color:#005c3c;font-weight:bold;'>{reservationCode}</span></div>
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Bedankt voor het correct gebruiken van Deelfabriek!<br>Het Deelfabriek team</div>
    </div>
    ";
        }

        public static string ReturnLate(
            string userName, string itemName, string reservationCode, string returnDate)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#d32f2f;margin-bottom:8px;'>Item niet op tijd teruggebracht</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Hallo {userName}, volgens onze gegevens werd het item <b>{itemName}</b> nog niet teruggebracht.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Reservatiecode:</b> <span style='font-size:1.4rem;color:#005c3c;font-weight:bold;'>{reservationCode}</span></div>
            <div><b>Voorziene retourdatum:</b> {returnDate}</div>
        </div>
        <div style='background:#ffeaea;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#a94442;border:1px solid #ffb3b3;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>⚠️</span>
            <span>Je reservatie is verlopen. Breng het item zo snel mogelijk terug via de retourprocedure in Deelfabriek.</span>
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Bedankt voor het correct gebruiken van Deelfabriek!<br>Het Deelfabriek team</div>
    </div>
    ";
        }

        public static string AdminLateNotification(
            string adminName, string userName, string itemName, string reservationCode, string returnDate, string status, string extensionStatus)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#d32f2f;margin-bottom:8px;'>Item niet teruggebracht</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Een gebruiker heeft zijn uitleentermijn overschreden zonder het item terug te brengen.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Gebruiker:</b> {userName}</div>
            <div><b>Item:</b> {itemName}</div>
            <div><b>Reservatiecode:</b> {reservationCode}</div>
            <div><b>Voorziene retourdatum:</b> {returnDate}</div>
            <div><b>Huidige status:</b> {status}</div>
            <div><b>Verlenging:</b> {extensionStatus}</div>
        </div>
        <div style='background:#ffeaea;border-radius:8px;padding:14px 18px;margin:0 auto 18px auto;max-width:420px;font-size:1.05rem;color:#a94442;border:1px solid #ffb3b3;display:flex;align-items:center;gap:10px;'>
            <span style='font-size:1.3rem;'>⚠️</span>
            <span>OPGELET: Item is nog steeds niet terug in het systeem!</span>
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Je kan eventueel contact opnemen met de gebruiker om hem eraan te herinneren het item terug te brengen of verdere actie te ondernemen volgens het uitleenbeleid.</div>
    </div>
    ";
        }

        public static string AdminReturnConfirmation(
            string adminName, string userName, string itemName, string reservationCode, string returnDate, string status)
        {
            return $@"
    <div style='font-family:sans-serif;max-width:600px;margin:auto;border-radius:14px;border:1px solid #e0e0e0;padding:32px;background:#fff;'>
        <div style='text-align:center;margin-bottom:24px;'>
            <img src='https://deelfabriek.be/logo.png' alt='Deelfabriek logo' style='height:56px;margin-bottom:8px;'>
        </div>
        <div style='text-align:center;'>
            <div style='font-size:2rem;font-weight:bold;color:#008a4e;margin-bottom:8px;'>Item teruggebracht</div>
            <div style='font-size:1.1rem;color:#333;margin-bottom:20px;'>Een gebruiker heeft het volgende item correct teruggebracht.</div>
        </div>
        <div style='background:#f5f5f5;border-radius:10px;padding:18px 20px;margin:0 auto 18px auto;max-width:400px;font-size:1.1rem;color:#222;'>
            <div style='margin-bottom:8px;'><b>Gebruiker:</b> {userName}</div>
            <div><b>Item:</b> {itemName}</div>
            <div><b>Reservatiecode:</b> {reservationCode}</div>
            <div><b>Datum retour:</b> {returnDate}</div>
            <div><b>Status:</b> {status}</div>
        </div>
        <div style='margin-top:32px;text-align:center;color:#888;font-size:1rem;'>Je hoeft verder geen actie te ondernemen.</div>
    </div>
    ";
        }
    }
} 