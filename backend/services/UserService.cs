namespace Deelkast.API.Services;


public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User> GetUserById(int id);
    Task AddUser(User user);
    Task UpdateUser(User user);
    Task DeleteUser(int id);
    Task<bool> EmailExists(string email);

    Task ToggleUserBlockStatus(int userId);

}

public class UserService : IUserService
{
    private readonly IGenericRepository<User> _userRepository;
    private readonly IUserRepository _customUserRepository;

    public UserService(IGenericRepository<User> userRepository, IUserRepository customUserRepository)
    {
        _userRepository = userRepository;
        _customUserRepository = customUserRepository;
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<User> GetUserById(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task AddUser(User user)
    {
        await _userRepository.AddAsync(user);
    }

    public async Task UpdateUser(User user)
    {
        await _userRepository.UpdateAsync(user);
    }

    public async Task DeleteUser(int id)
    {
        await _userRepository.DeleteAsync(id);
    }

    public async Task<bool> EmailExists(string email)
    {
        return await _customUserRepository.EmailExists(email);
    }

    public async Task ToggleUserBlockStatus(int userId)
    {
        await _customUserRepository.ToggleUserBlockStatus(userId);
    }


}