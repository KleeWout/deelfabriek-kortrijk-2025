namespace Deelkast.API.Validators;


public class UserValidator : AbstractValidator<User>
{
    private readonly IUserService _userService;

    public UserValidator(IUserService userService)
    {
        _userService = userService;

        RuleFor(user => user.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.");

        RuleFor(user => user.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.");


        RuleFor(user => user.PhoneNumber)
            .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters.")
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number must be a valid international format.");

        // Only check email existence for CREATE context
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .MustAsync(async (email, cancellation) => !await userService.EmailExists(email))
            .WithMessage("Email already exists")
            .When((user, context) => context.RootContextData.ContainsKey("Operation") && 
                                     context.RootContextData["Operation"].ToString() == "CREATE");


        RuleFor(address => address.Street)
            .NotEmpty().WithMessage("Street is required.")
            .MaximumLength(200).WithMessage("Street cannot exceed 200 characters.");

        RuleFor(address => address.City)
            .NotEmpty().WithMessage("City is required.")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters.");

        RuleFor(address => address.Bus)
            .MaximumLength(50).WithMessage("Bus cannot exceed 50 characters.")
            .When(address => !string.IsNullOrEmpty(address.Bus));

        RuleFor(address => address.PostalCode)
            .NotEmpty().WithMessage("Postal code is required.")
            .MaximumLength(10).WithMessage("Postal code cannot exceed 10 characters.");

    }
}
