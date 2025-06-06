namespace Deelkast.API.Repositories;

public interface IOpeningsUrenRepository
{
    Task<List<OpeningHour>> GetAllOpeningHours();
    Task<OpeningHour> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningHour> UpdateOpeningHourAsync(OpeningHour OpeningHour);
}

public class OpeningsUrenRepository : IOpeningsUrenRepository
{
    private readonly ApplicationDbContext _context;

    public OpeningsUrenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OpeningHour>> GetAllOpeningHours()
    {
        return await _context.OpeningHours.ToListAsync();
    }

    public async Task<OpeningHour> GetOpeningHourByIdAsync(string idDay)
    {
        return await _context.OpeningHours.FindAsync(idDay);
    }

    public async Task<OpeningHour> UpdateOpeningHourAsync(OpeningHour openingHour)
    {
        _context.OpeningHours.Update(openingHour);
        await _context.SaveChangesAsync();
        return openingHour;
    }
}