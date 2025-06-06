namespace Deelkast.API.Services;

public interface IOpeningsHoursService
{
    Task<List<OpeningHour>> GetAllOpeningHoursAsync();
    Task<OpeningHour> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningHour> UpdateOpeningHourAsync(OpeningHour OpeningHour);
}

public class OpeningsHoursService : IOpeningsHoursService
{
    private readonly IOpeningsUrenRepository _openingsUrenRepository;

    public OpeningsHoursService(IOpeningsUrenRepository openingsUrenRepository)
    {
        _openingsUrenRepository = openingsUrenRepository;
    }

    public async Task<List<OpeningHour>> GetAllOpeningHoursAsync()
    {
        return await _openingsUrenRepository.GetAllOpeningHours();
    }

    public async Task<OpeningHour> GetOpeningHourByIdAsync(string idDay)
    {
        return await _openingsUrenRepository.GetOpeningHourByIdAsync(idDay);
    }

    public async Task<OpeningHour> UpdateOpeningHourAsync(OpeningHour openingHour)
    {
        return await _openingsUrenRepository.UpdateOpeningHourAsync(openingHour);
    }
}
