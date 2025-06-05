namespace Deelkast.API.Services;

public interface IOpeningHoursService
{
    Task<List<OpeningsHours>> GetAllOpeningHoursAsync();
    Task<OpeningsHours> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningsHours> UpdateOpeningHourAsync(OpeningsHours openingsHours);
}

public class OpeningHoursService : IOpeningHoursService
{
    private readonly IOpeningHoursRepository _openingHoursRepository;

    public OpeningHoursService(IOpeningHoursRepository openingHoursRepository)
    {
        _openingHoursRepository = openingHoursRepository;
    }

    public async Task<List<OpeningsHours>> GetAllOpeningHoursAsync()
    {
        return await _openingHoursRepository.GetAllOpeningHours();
    }

    public async Task<OpeningsHours> GetOpeningHourByIdAsync(string idDay)
    {
        return await _openingHoursRepository.GetOpeningHourByIdAsync(idDay);
    }

    public async Task<OpeningsHours> UpdateOpeningHourAsync(OpeningsHours openingsHours)
    {
        return await _openingHoursRepository.UpdateOpeningHourAsync(openingsHours);
    }
}
