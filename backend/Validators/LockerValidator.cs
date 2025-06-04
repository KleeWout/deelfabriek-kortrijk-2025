namespace Deelkast.API.Validators;



public class LockerValidator : AbstractValidator<Locker>
{
    public LockerValidator(ILockerRepository lockerRepository)
    {
        RuleFor(locker => locker.LockerNumber)
            .NotEmpty().WithMessage("Locker number is required.")
            .GreaterThan(0).WithMessage("Locker number must be greater than 0.")
            .MustAsync(async (locker, lockerNumber, _) =>
                        {
                            var conflict = await lockerRepository.AnyOtherLockerWithNumber(locker.Id, lockerNumber);
                            return !conflict;
                        }).WithMessage("Locker number must be unique.");
    }
}

