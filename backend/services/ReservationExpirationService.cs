using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Deelkast.API.Services;


public class ReservationExpirationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(30); 

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
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Background reservation expiration failed: {ex.Message}");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
