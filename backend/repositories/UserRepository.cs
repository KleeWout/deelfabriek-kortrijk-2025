namespace Deelkast.API.Repositories;



public interface IUserRepository
{

    Task<bool> EmailExists(string email);
    // block user
    Task BlockUser(int userId);
    // unblock user
    Task UnblockUser(int userId);

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

    public async Task BlockUser(int userId)
    {
        var user = await _genericRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.IsBlocked = true;
            await _genericRepository.UpdateAsync(user);
        }
    }

    public async Task UnblockUser(int userId)
    {
        var user = await _genericRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.IsBlocked = false;
            await _genericRepository.UpdateAsync(user);
        }
    }
    
  

}

