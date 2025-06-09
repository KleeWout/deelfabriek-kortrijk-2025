namespace Deelkast.API.Repositories;




public interface IUserRepository
{

    Task<bool> EmailExists(string email);
    // block user
    Task BlockUser(int userId);
    // unblock user
    Task UnblockUser(int userId);

    Task<User> GetUser(newUserDto user);

}

public class UserRepository : IUserRepository
{
    private readonly IGenericRepository<User> _genericRepository;

    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;


    public UserRepository(IGenericRepository<User> genericRepository, ApplicationDbContext context, IMapper mapper)
    {
        _genericRepository = genericRepository;
        _context = context;
        _mapper = mapper;
    }

    public async Task<User> GetUser(newUserDto user)
     {
        // Using FirstOrDefaultAsync since email should be unique
        var result = await _context.User.FirstOrDefaultAsync(u => u.Email == user.Email);
        if (result == null)
        {
            // Map DTO to User entity
            var newUser = _mapper.Map<User>(user);
            await _genericRepository.AddAsync(newUser);
            result = newUser;
        }
        return result;
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

