namespace Deelkast.API.Validators;


public class LockerValidator : AbstractValidator<Locker>

{

    public LockerValidator()
    {
        RuleFor(locker => locker.LockerNumber)
            .NotEmpty().WithMessage("Locker number is required.")
            .GreaterThan(0).WithMessage("Locker number must be greater than 0.");
    }
}