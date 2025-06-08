
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// read settings from json
var databaseSettings = builder.Configuration.GetSection("DatabaseSettings");
builder.Services.Configure<DatabaseSettings>(databaseSettings);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IGenericRepository<Item>, GenericRepository<Item>>();
builder.Services.AddScoped<IGenericRepository<Locker>, GenericRepository<Locker>>();
builder.Services.AddScoped<IGenericRepository<User>, GenericRepository<User>>();
builder.Services.AddScoped<IGenericRepository<Category>, GenericRepository<Category>>();
builder.Services.AddScoped<IGenericRepository<Reservation>, GenericRepository<Reservation>>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<ILockerRepository, LockerRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<ILockerService, LockerService>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IReservationService, ReservationService>();

builder.Services.AddValidatorsFromAssemblyContaining<ItemValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();

// builder.Services.AddAuthorizationBuilder();
// builder.Services.AddAuthentication().AddBearerToken();

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// builder.Services.AddAuthorizationBuilder();
// builder.Services.AddAuthentication().AddBearerToken();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddHostedService<ReservationExpirationService>();

builder.Services.AddAutoMapper(typeof(Program));
var app = builder.Build();
// app.UseAuthentication();
// app.UseAuthorization();

app.MapGet("/", () => "Hello World!");

app.MapGroup("/items").GroupPublicItems();
app.MapGroup("/users").GroupPublicUsers();
app.MapGroup("/categories").GroupPublicCategories();
app.MapGroup("/reservations").GroupReservations();

// add authorization later 
var adminApi = app.MapGroup("/dashboard");
adminApi.MapGroup("/items").GroupAdminItems();
adminApi.MapGroup("/lockers").GroupAdminLockers();
adminApi.MapGroup("/categories").GroupAdminCategories();
adminApi.MapGroup("/users").GroupAdminUsers();
adminApi.MapGroup("/reservations").GroupAdminReservations();



app.Run();

public partial class Program { }
