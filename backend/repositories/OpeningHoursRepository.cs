namespace Deelkast.API.Repositories;

public interface IOpeningHoursRepository
{
    Task<List<OpeningsHours>> GetAllOpeningHours();
    Task<OpeningsHours> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningsHours> UpdateOpeningHourAsync(OpeningsHours openingsHours);
}

public class OpeningHoursRepository : IOpeningHoursRepository
{
    private readonly ApplicationDbContext _context;

    public OpeningHoursRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OpeningsHours>> GetAllOpeningHours()
    {
        return await _context.OpeningsHours.ToListAsync();
    }

    public async Task<OpeningsHours> GetOpeningHourByIdAsync(string idDay)
    {
        return await _context.OpeningsHours.FindAsync(idDay);
    }

    public async Task<OpeningsHours> UpdateOpeningHourAsync(OpeningsHours openingsHours)
    {
        _context.OpeningsHours.Update(openingsHours);
        await _context.SaveChangesAsync();
        return openingsHours;
    }
}
