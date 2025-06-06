public interface IReportService
{
    Task<List<ReportDto>> GetAllReports();
    Task<ReportDto?> GetReportById(int id);
    Task AddReport(Report Report);
    Task UpdateReport(Report Report);
    Task DeleteReport(int id);
}

public class ReportService : IReportService
{
    private readonly IGenericRepository<Report> _ReportRepositoryGeneric;
    private readonly IReportRepository _ReportRepository;
    private readonly IMapper _mapper;

    public ReportService(
        IGenericRepository<Report> reportRepositoryGeneric,
        IReportRepository reportRepository,
        IMapper mapper)
    {
        _ReportRepository = reportRepository;
        _ReportRepositoryGeneric = reportRepositoryGeneric;
        _mapper = mapper;
    }

    public async Task<List<ReportDto>> GetAllReports()
    {
        var reports = await _ReportRepository.GetAllWithDetailsAsync();
        return _mapper.Map<List<ReportDto>>(reports);
    }

    public async Task<ReportDto?> GetReportById(int id)
    {
        var report = await _ReportRepository.GetByIdWithDetailsAsync(id);
        return _mapper.Map<ReportDto>(report);
    }

    public async Task AddReport(Report Report)
    {
        await _ReportRepository.AddAsync(Report);
    }

    public async Task UpdateReport(Report Report)
    {
        await _ReportRepositoryGeneric.UpdateAsync(Report);
    }

    public async Task DeleteReport(int id)
    {
        await _ReportRepositoryGeneric.DeleteAsync(id);
    }
}