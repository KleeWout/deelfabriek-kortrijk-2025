namespace Deelkast.API.Validators;


public class ItemValidator : AbstractValidator<Item>

{
    public ItemValidator()
    {
        RuleFor(x => x.ImageSrc)
            .NotEmpty().WithMessage("Image URL is required");
            // .Must(BeAValidUrl).WithMessage("Image URL must be a valid URL");

        RuleFor(x => x.PricePerWeek)
                .NotNull().WithMessage("Price per week is required")
                .GreaterThanOrEqualTo(0).WithMessage("Price per week must be 0.00 or more")
                .PrecisionScale(10, 2, false).WithMessage("Price per week must have maximum 2 decimal places");

        RuleFor(x => x.Weight)
                .GreaterThanOrEqualTo(0).WithMessage("Weight (kg) must be 0.00 or more")
                .PrecisionScale(10, 2, false).WithMessage("Weight must have maximum 2 decimal places");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .MaximumLength(700).WithMessage("Description cannot exceed 700 characters");

    }

    private bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && 
               (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}