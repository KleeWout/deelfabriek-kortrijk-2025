namespace Deelkast.API.Repositories;



public interface IUserRepository
{

    Task<bool> EmailExists(string email);
    Task ToggleUserBlockStatus(int userId);

}

public class UserRepository : IUserRepository
{
    private readonly IGenericRepository<User> _genericRepository;

    private readonly ApplicationDbContext _context;


    public UserRepository(IGenericRepository<User> genericRepository, ApplicationDbContext context)
    {
        _genericRepository = genericRepository;
        _context = context;
    }


    public async Task<bool> EmailExists(string email)
    {
        var users = await _genericRepository.GetAllAsync();
        return users.Any(u => u.Email == email);
    }

     public async Task ToggleUserBlockStatus(int userId)
    {
        var user = await _genericRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.IsBlocked = !user.IsBlocked; // Toggle tussen true/false
            await _genericRepository.UpdateAsync(user);
        }
    }
  

}

