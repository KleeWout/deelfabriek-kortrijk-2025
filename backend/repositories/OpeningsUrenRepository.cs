namespace Deelkast.API.Repositories;

public interface IOpeningsUrenRepository
{
    Task<List<OpeningUren>> GetAllOpeningHours();
    Task<OpeningUren> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningUren> UpdateOpeningHourAsync(OpeningUren openingUren);
}

public class OpeningsUrenRepository : IOpeningsUrenRepository
{
    private readonly ApplicationDbContext _context;

    public OpeningsUrenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OpeningUren>> GetAllOpeningHours()
    {
        return await _context.OpeningUren.ToListAsync();
    }

    public async Task<OpeningUren> GetOpeningHourByIdAsync(string idDay)
    {
        return await _context.OpeningUren.FindAsync(idDay);
    }

    public async Task<OpeningUren> UpdateOpeningHourAsync(OpeningUren openingUren)
    {
        _context.OpeningUren.Update(openingUren);
        await _context.SaveChangesAsync();
        return openingUren;
    }
}