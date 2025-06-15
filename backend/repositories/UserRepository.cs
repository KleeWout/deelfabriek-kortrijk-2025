namespace Deelkast.API.Repositories;




public interface IUserRepository
{

    Task<bool> EmailExists(string email);
    Task ToggleUserBlockStatus(int userId);
    Task<User> GetUser(newUserDto user);
    Task<User> GetUserByEmailAsync(string email);

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
    public async Task ToggleUserBlockStatus(int userId)
    {
        var user = await _genericRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.IsBlocked = !user.IsBlocked; // Toggle tussen true/false
            await _genericRepository.UpdateAsync(user);
        }
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _context.User.FirstOrDefaultAsync(u => u.Email == email);
    }

}

