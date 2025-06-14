
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add CORS service with policy that allows any origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



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
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IGenericRepository<Report>, GenericRepository<Report>>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IOpeningHoursRepository, OpeningHoursRepository>();
builder.Services.AddScoped<IOpeningHoursService, OpeningHoursService>();
builder.Services.AddSingleton<MailService>();
builder.Services.AddScoped<IEmailNotificationService, EmailNotificationService>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();



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
// Enable CORS middleware - this line was missing
app.UseCors("AllowAll");

app.MapGet("/", () => "Welcome to the deelfabriek API!");

app.MapGet("/photo", (IHostEnvironment env, string? src) =>
{
    if (string.IsNullOrWhiteSpace(src))
        return Results.BadRequest("Missing 'src' query parameter.");

    // Only allow file names, not paths
    var fileName = Path.GetFileName(src);
    var filePath = Path.Combine(env.ContentRootPath, "Uploads", fileName);

    if (!System.IO.File.Exists(filePath))
        return Results.NotFound("File not found.");

    var contentType = "application/octet-stream";
    if (fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
        contentType = "image/png";
    else if (fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) || fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase))
        contentType = "image/jpeg";

    return Results.File(filePath, contentType);
});


app.MapGroup("/items").GroupPublicItems();
app.MapGroup("/users").GroupPublicUsers();
app.MapGroup("/categories").GroupPublicCategories();
app.MapGroup("/reservations").GroupReservations();
app.MapGroup("/openingshours").GroupPublicOpeningHours();
app.MapGroup("/reports").GroupPublicReports();
app.MapGroup("/notifications").GroupPublicNotifications();

// add authorization later 
var adminApi = app.MapGroup("/dashboard");
adminApi.MapGroup("/items").GroupAdminItems();
adminApi.MapGroup("/lockers").GroupAdminLockers();
adminApi.MapGroup("/categories").GroupAdminCategories();
adminApi.MapGroup("/users").GroupAdminUsers();
adminApi.MapGroup("/reservations").GroupAdminReservations();
adminApi.MapGroup("/openingshours").GroupAdminOpeningHours();
adminApi.MapGroup("/reports").GroupAdminReports();

app.MapGet("/mail", async ( MailService mailSender) =>
{
    try
    {
        await mailSender.SendMailAsync("wout.klee@gmail.com", "Test Email2", "<h1>This is a test email</h1><p>If you see this, the email service is working!</p>");
        return Results.Ok($"Email sent successfully");
    }
    catch (Exception)
    {
        return Results.Problem("Failed to send email. Please check the SMTP configuration.");
    }
});


app.Run();

public partial class Program { }
