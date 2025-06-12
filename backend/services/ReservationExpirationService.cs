using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Deelkast.API.Services;


public class ReservationExpirationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromHours(1); 

    public ReservationExpirationService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var reservationService = scope.ServiceProvider.GetRequiredService<IReservationService>();

            try
            {
                await reservationService.ExpireOverdueReservations();
                // Process fines and auto-block users - also send late notifications 
                await reservationService.ProcessOverdueLoansAndFines();
                // reminder 48 hours before return
                await reservationService.SendReturnReminders48Hours();
                // reminder when item is back available 
                // -----
              Console.WriteLine($"[INFO] Processed reservations and fines at {DateTime.Now}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Background reservation/fine processing failed: {ex.Message}");
            }
            await Task.Delay(_interval, stoppingToken);
        }
    }
}
