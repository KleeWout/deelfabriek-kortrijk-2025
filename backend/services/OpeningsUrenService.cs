namespace Deelkast.API.Services;

public interface IOpeningsUrenService
{
    Task<List<OpeningUren>> GetAllOpeningHoursAsync();
    Task<OpeningUren> GetOpeningHourByIdAsync(string idDay);
    Task<OpeningUren> UpdateOpeningHourAsync(OpeningUren openingUren);
}

public class OpeningsUrenService : IOpeningsUrenService
{
    private readonly IOpeningsUrenRepository _openingsUrenRepository;

    public OpeningsUrenService(IOpeningsUrenRepository openingsUrenRepository)
    {
        _openingsUrenRepository = openingsUrenRepository;
    }

    public async Task<List<OpeningUren>> GetAllOpeningHoursAsync()
    {
        return await _openingsUrenRepository.GetAllOpeningHours();
    }

    public async Task<OpeningUren> GetOpeningHourByIdAsync(string idDay)
    {
        return await _openingsUrenRepository.GetOpeningHourByIdAsync(idDay);
    }

    public async Task<OpeningUren> UpdateOpeningHourAsync(OpeningUren openingUren)
    {
        return await _openingsUrenRepository.UpdateOpeningHourAsync(openingUren);
    }
}
