using Deelkast.API.Models;
using Deelkast.API.Context;
using Microsoft.EntityFrameworkCore;

namespace Deelkast.API.Repositories;

public interface IReportRepository
{
    Task<List<Report>> GetAllWithDetailsAsync();
    Task<Report?> GetByIdWithDetailsAsync(int id);
    Task AddAsync(Report report);
}

public class ReportRepository : IReportRepository
{
    private readonly ApplicationDbContext _context;

    public ReportRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Report>> GetAllWithDetailsAsync()
    {
        return await _context.Set<Report>()
            .Include(r => r.Reservation)
                .ThenInclude(res => res.User)
            .Include(r => r.Reservation)
                .ThenInclude(res => res.Item)
            .ToListAsync();
    }

    public async Task<Report?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Set<Report>()
            .Include(r => r.Reservation)
                .ThenInclude(res => res.User)
            .Include(r => r.Reservation)
                .ThenInclude(res => res.Item)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
    public async Task AddAsync(Report report)
    {
        if (report.Rating <= 3)
        {
            report.Status = false;
        }
        else
        {
            report.Status = true;
        }
        report.CreatedAt = DateTime.UtcNow; // Ensure CreatedAt is set to current time
        await _context.Set<Report>().AddAsync(report);
        await _context.SaveChangesAsync();
    }
}
