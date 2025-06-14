public static class AdminRoutes
{
    public static RouteGroupBuilder GroupAdminLockers(this RouteGroupBuilder group)
    {

        // get lockers
        group.MapGet("/", async (ILockerService lockerService) =>
        {
            var lockers = await lockerService.GetAllLockers();
            if (lockers == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(lockers);
        });

        // get locker by id
        group.MapGet("/{id}", async (int id, ILockerService lockerService) =>
        {
            var locker = await lockerService.GetLockerById(id);
            if (locker == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(locker);
        });
        //create a new locker
        group.MapPost("/", async (Locker locker, ILockerService lockerService, IValidator<Locker> validator, IItemService itemService) =>
        {
            var validationResult = await validator.ValidateAsync(locker);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            try
            {
                var saved = await lockerService.AddLocker(locker);

                // If an item is linked, update the item's LockerId to the new locker
                if (locker.ItemId.HasValue && locker.ItemId.Value > 0)
                {
                    var item = await itemService.GetItemById(locker.ItemId.Value);
                    if (item != null)
                    {
                        item.LockerId = saved.Id;
                        await itemService.UpdateItem(item);
                    }
                }

                return Results.Created($"/lockers/{saved.Id}", saved);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });
        group.MapPut("/{id:int}", async (int id, Locker locker, ILockerService lockerService, IValidator<Locker> validator
        ) =>
        {
            locker.Id = id;

            var validationResult = await validator.ValidateAsync(locker);
            if (!validationResult.IsValid)
                return Results.BadRequest(validationResult.Errors);

            try
            {
                var updated = await lockerService.UpdateLocker(id, locker);
                return Results.Ok(updated);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });

        // delete locker
        group.MapDelete("/{id}", async (int id, ILockerService lockerService, IItemService itemService) =>
        {
            var existingLocker = await lockerService.GetLockerById(id);
            if (existingLocker == null)
            {
                return Results.NotFound();
            }

            await lockerService.DeleteLocker(id);
            // If the locker had an item, unbind it
            if (existingLocker.ItemId.HasValue)
            {
                var item = await itemService.GetItemById(existingLocker.ItemId.Value);
                if (item != null)
                {
                    item.LockerId = null; // Unbind the item from the locker
                    await itemService.UpdateItem(item);
                }
            }

            return Results.NoContent();
        });

        // get all empty lockers
        group.MapGet("/empty", async (ILockerService lockerService) =>
        {
            var emptyLockers = await lockerService.GetAllEmptyLockers();
            if (emptyLockers == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(emptyLockers);
        });

        return group;


    }

    public static RouteGroupBuilder GroupAdminCategories(this RouteGroupBuilder group)
    {
        // get all categories
        group.MapGet("/", async (IItemService itemService) =>
        {
            var categories = await itemService.GetAllCategories();
            if (categories == null || !categories.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(categories);
        });
        // add category
        group.MapPost("/", async (Category category, IItemService itemService) =>
        {
            if (category == null)
            {
                return Results.BadRequest("Category cannot be null");
            }

            try
            {
                await itemService.AddCategory(category);
                return Results.Created($"/categories/{category.Id}", category);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the category: {ex.Message}");
            }
        });

        // delete category
        group.MapDelete("/{category}", async (string category, IItemService itemService) =>
        {

            try
            {
                await itemService.DeleteCategory(category);
                return Results.Ok();
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while deleting the category: {ex.Message}");
            }
        });

        return group;
    }

    public static RouteGroupBuilder GroupAdminUsers(this RouteGroupBuilder group)
    {
        // get all users
        group.MapGet("/", async (IUserService userService) =>
        {
            var users = await userService.GetAllUsers();
            if (users == null || !users.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(users);
        });

        // get user by id
        group.MapGet("/{id}", async (int id, IUserService userService) =>
        {
            var user = await userService.GetUserById(id);
            if (user == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(user);
        });

        // delete user
        group.MapDelete("/{id}", async (int id, IUserService userService) =>
        {
            var existingUser = await userService.GetUserById(id);
            if (existingUser == null)
            {
                return Results.NotFound();
            }

            await userService.DeleteUser(id);
            return Results.NoContent();
        });
        group.MapPut("/{id}", async (int id, User user, IUserService userService, UserValidator userValidator) =>
        {
            // Validate the incoming user data
            var validationResult = await userValidator.ValidateAsync(user);
            if (!validationResult.IsValid)
            {
                // Extract only the validation error messages
                var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return Results.BadRequest(warnings); // Return only the warnings
            }

            // Get the existing user (this will be tracked by EF)
            var existingUser = await userService.GetUserById(id);
            if (existingUser == null)
            {
                return Results.NotFound($"User with ID {id} not found.");
            }

            // Check if email already exists for another user (if email is being changed)
            if (existingUser.Email != user.Email && await userService.EmailExists(user.Email))
            {
                return Results.Conflict("A user with this email already exists.");
            }

            // Update the properties of the existing tracked entity
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Email = user.Email;
            existingUser.Street = user.Street;
            existingUser.City = user.City;
            existingUser.Bus = user.Bus;
            existingUser.PostalCode = user.PostalCode;

            try
            {
                await userService.UpdateUser(existingUser);
                return Results.Ok(existingUser);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while updating the user: {ex.Message}");
            }
        });

        // block-unblock toggle
        group.MapPost("/{id}/toggle-block", async (int id, IUserService userService) =>
        {
            var existingUser = await userService.GetUserById(id);
            if (existingUser == null)
            {
                return Results.NotFound($"User with ID {id} not found.");
            }

            try
            {
                await userService.ToggleUserBlockStatus(id);
                return Results.Ok(existingUser);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while toggling the block status: {ex.Message}");
            }
        });

        return group;
    }

    public static RouteGroupBuilder GroupAdminItems(this RouteGroupBuilder group)
    {        // get items for admin panel
        group.MapGet("/", async (IItemService itemService) =>
        {
            var items = await itemService.GetAllItemsAdmin();
            if (items == null || !items.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(items);
        });

        // get current available items
        group.MapGet("/available", async (IItemService itemService) =>
        {
            var availableItems = await itemService.CurrentAvailableItems();
            return Results.Ok(availableItems);
        });
        // get current loaned items
        group.MapGet("/loaned", async (IItemService itemService) =>
        {
            var loanedItems = await itemService.CurrentLoanedItems();
            return Results.Ok(loanedItems);
        });

        // post items
        // Combined endpoint for posting items with or without image
        group.MapPost("/", async (HttpContext httpContext, IItemService itemService, ItemValidator validator) =>
        {
            try
            {
                Item item;

                // Check content type to determine how to handle the request
                var contentType = httpContext.Request.ContentType ?? string.Empty;

                if (contentType.StartsWith("multipart/form-data"))
                {
                    // Handle form data with possible file upload
                    var form = await httpContext.Request.ReadFormAsync();

                    // Extract item data from form
                    item = new Item
                    {
                        Title = form["title"],
                        Description = form["description"],
                        PricePerWeek = decimal.TryParse(form["pricePerWeek"], out var price) ? price : null,
                        HowToUse = form["howToUse"],
                        Accesories = form["accesories"],
                        Weight = decimal.TryParse(form["weight"], out var weight) ? weight : null,
                        Dimensions = form["dimensions"],
                        Tip = form["tip"],
                        Status = ItemStatus.Ongebruikt,
                        LockerId = int.TryParse(form["lockerId"], out var lockerId) ? lockerId : null,
                        Category = form["category"],
                        ImageSrc = "" // Set empty initially to pass validation
                    };

                    // Handle file upload
                    if (form.Files.Count > 0)
                    {
                        var file = form.Files[0];

                        // Validate file type
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                        if (!allowedExtensions.Contains(fileExtension))
                        {
                            return Results.BadRequest(new { errors = new[] { "Only image files are allowed" } });
                        }

                        // Create uploads directory if it doesn't exist
                        var uploadsPath = Path.GetFullPath("./uploads/");
                        Directory.CreateDirectory(uploadsPath);

                        // Use original filename
                        var fileName = file.FileName;
                        var filePath = Path.Combine(uploadsPath, fileName);

                        // Save the file
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        // Set the filename
                        item.ImageSrc = fileName;
                    }
                }
                else
                {
                    // Handle JSON request
                    item = await httpContext.Request.ReadFromJsonAsync<Item>();
                    if (item == null)
                    {
                        return Results.BadRequest("Invalid item data");
                    }
                }

                // Validate the item
                var validationResult = await validator.ValidateAsync(item);
                if (!validationResult.IsValid)
                {
                    var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return Results.BadRequest(warnings);
                }

                // Save item to database
                await itemService.AddItem(item);
                return Results.Created($"/items/{item.Id}", item);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the item: {ex.Message}");
            }
        }).DisableAntiforgery();
        // Keep compatibility with existing frontend code that uses /with-image endpoint
        group.MapPost("/with-image", async (HttpContext httpContext, IItemService itemService, ItemValidator validator) =>
        {
            // Use the same implementation as the main endpoint
            try
            {
                Item item;
                var form = await httpContext.Request.ReadFormAsync();

                // Extract item data from form
                item = new Item
                {
                    Title = form["title"],
                    Description = form["description"],
                    PricePerWeek = decimal.TryParse(form["pricePerWeek"], out var price) ? price : null,
                    HowToUse = form["howToUse"],
                    Accesories = form["accesories"],
                    Weight = decimal.TryParse(form["weight"], out var weight) ? weight : null,
                    Dimensions = form["dimensions"],
                    Tip = form["tip"],
                    Status = Enum.TryParse<ItemStatus>(form["status"], out var status) ? status : ItemStatus.Beschikbaar,
                    LockerId = int.TryParse(form["lockerId"], out var lockerId) ? lockerId : null,
                    Category = form["category"],
                    ImageSrc = "" // Set empty initially to pass validation
                };

                // Handle file upload
                if (form.Files.Count > 0)
                {
                    var file = form.Files[0];

                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return Results.BadRequest(new { errors = new[] { "Only image files are allowed" } });
                    }

                    // Create uploads directory if it doesn't exist
                    var uploadsPath = Path.GetFullPath("./uploads/");
                    Directory.CreateDirectory(uploadsPath);

                    // Use original filename
                    var fileName = file.FileName;
                    var filePath = Path.Combine(uploadsPath, fileName);

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Set the filename
                    item.ImageSrc = fileName;
                }

                // Validate the item
                var validationResult = await validator.ValidateAsync(item);
                if (!validationResult.IsValid)
                {
                    var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return Results.BadRequest(new { errors = warnings });
                }

                // Save item to database
                await itemService.AddItem(item);
                return Results.Created($"/items/{item.Id}", item);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the item: {ex.Message}");
            }
        }).DisableAntiforgery();

        //edit item
        group.MapPut("/{id}", async (HttpRequest request, int id, IItemService itemService, ItemValidator validator) =>
        {
            // Get the existing item from the database
            var existingItem = await itemService.GetItemById(id);
            if (existingItem == null)
                return Results.NotFound("Item not found.");

            // Read the form data
            var form = await request.ReadFormAsync();
            Console.WriteLine(form["accesories"]);
            // Update item properties from form
            existingItem.Title = form["title"];
            existingItem.Description = form["description"];
            existingItem.PricePerWeek = decimal.TryParse(form["pricePerWeek"], out var price) ? price : null;
            existingItem.HowToUse = form["howToUse"];
            existingItem.Accesories = form["accesories"];
            existingItem.Weight = decimal.TryParse(form["weight"], out var weight) ? weight : null;
            existingItem.Dimensions = form["dimensions"];
            existingItem.Tip = form["tip"];
            existingItem.Status = Enum.TryParse<ItemStatus>(form["status"], out var status) ? status : ItemStatus.Beschikbaar;
            existingItem.LockerId = int.TryParse(form["lockerId"], out var lockerId) ? lockerId : null;
            existingItem.Category = form["category"];
            existingItem.TimesLoaned = int.TryParse(form["timesLoaned"], out var timesLoaned) ? timesLoaned : 0;

            // Handle image replacement
            if (form.Files.Count > 0)
            {
                var file = form.Files[0];
                if (file.Length == 0)
                {
                    return Results.BadRequest("File is empty.");
                }
                else
                {
                    Console.WriteLine($"Received file: {file.FileName}, Size: {file.Length} bytes");
                }
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return Results.BadRequest(new { errors = new[] { "Only image files are allowed" } });
                }

                // Delete old image if it exists
                if (!string.IsNullOrEmpty(existingItem.ImageSrc))
                {
                    var oldImagePath = Path.GetFullPath("./uploads/" + existingItem.ImageSrc);
                    if (File.Exists(oldImagePath))
                    {
                        File.Delete(oldImagePath);
                    }
                }

                // Save new image
                var uploadsPath = Path.GetFullPath("./uploads/");
                Directory.CreateDirectory(uploadsPath);
                var fileName = file.FileName;
                var filePath = Path.Combine(uploadsPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                existingItem.ImageSrc = fileName;
            }

            // Validate the updated item
            var validationResult = await validator.ValidateAsync(existingItem);
            if (!validationResult.IsValid)
            {
                var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return Results.BadRequest(warnings);
            }

            try
            {
                await itemService.UpdateItem(existingItem);
                var updatedItem = await itemService.GetItemById(id);
                return Results.Ok(updatedItem);
            }
            catch (InvalidOperationException iex)
            {
                return Results.NotFound(iex.Message);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while updating the item: {ex.Message}");
            }
        }).DisableAntiforgery();

        // delete item
        group.MapDelete("/{id}", async (int id, IItemService itemService) =>
        {
            var existingItem = await itemService.GetItemById(id);
            if (existingItem == null)
            {
                return Results.NotFound();
            }

            await itemService.DeleteItem(id);
            return Results.NoContent();
        });

        return group;
    }

    public static RouteGroupBuilder GroupAdminReservations(this RouteGroupBuilder group)
    {
        // get all reservations
        group.MapGet("/", async (IReservationService reservationService) =>
        {
            var reservations = await reservationService.GetAllReservations();
            if (reservations == null || !reservations.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(reservations);
        });

        group.MapDelete("/{id}", async (int id, IReservationService reservationService) =>
        {
            var existingReservation = await reservationService.GetReservationbyId(id);
            if (existingReservation == null)
            {
                return Results.NotFound();
            }

            await reservationService.DeleteReservation(id);
            return Results.NoContent();
        });

        // countoverdueitem
        group.MapGet("/overdue", async (IReservationService reservationService) =>
        {
            var count = await reservationService.CountOverdueItemsAsync();
            return Results.Ok(count);
        });

        // total times items loaned
        group.MapGet("/total-loaned", async (IReservationService reservationService) =>
        {
            var total = await reservationService.TotalTimesItemsLoanedAsync();
            return Results.Ok(total);
        });

        return group;
    }

    public static RouteGroupBuilder GroupAdminOpeningHours(this RouteGroupBuilder group)
    {
        // get all opening hours
        group.MapGet("/", async (IOpeningHoursService openingHourService) =>
        {
            var openingsHours = await openingHourService.GetAllOpeningHoursAsync();
            if (openingsHours == null || !openingsHours.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(openingsHours);
        });

        // get by day (idDay)
        group.MapGet("/{idDay}", async (string idDay, IOpeningHoursService openingHourService) =>
        {
            var openingHour = await openingHourService.GetOpeningHourByIdAsync(idDay);
            if (openingHour == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(openingHour);
        });

        // update opening hours for a day
        group.MapPut("/{idDay}", async (string idDay, OpeningsHours input, IOpeningHoursService openingHourService) =>
        {
            try
            {
                Console.WriteLine($"Updating opening hours for day: {idDay}");
                var existing = await openingHourService.GetOpeningHourByIdAsync(idDay);
                if (existing == null)
                {
                    return Results.NotFound($"Opening hour with ID {idDay} not found.");
                }

                // Validation: if any hour is filled, morning hours must be filled
                bool ochtendHalfFilled = (input.OpenTimeMorning != null) != (input.CloseTimeMorning != null);
                bool middagHalfFilled = (input.OpenTimeAfternoon != null) != (input.CloseTimeAfternoon != null);

                if (ochtendHalfFilled || middagHalfFilled)
                {
                    return Results.BadRequest("Vul zowel begin- als einduur in voor ochtend of middag, of laat beide leeg.");
                }

                // Always update the times
                existing.OpenTimeMorning = input.OpenTimeMorning;
                existing.CloseTimeMorning = input.CloseTimeMorning;
                existing.OpenTimeAfternoon = input.OpenTimeAfternoon;
                existing.CloseTimeAfternoon = input.CloseTimeAfternoon;

                // If all hours are empty/null, force closed
                bool allEmpty =
                    input.OpenTimeMorning == null &&
                    input.CloseTimeMorning == null &&
                    input.OpenTimeAfternoon == null &&
                    input.CloseTimeAfternoon == null;

                if (allEmpty)
                {
                    existing.Open = false;
                }
                else
                {
                    existing.Open = input.Open; // Use frontend value (can be false with hours)
                }

                var updated = await openingHourService.UpdateOpeningHourAsync(existing);
                return Results.Ok(updated);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while updating the opening hour: {ex.Message}");
            }
        });

        return group;
    }

    public static RouteGroupBuilder GroupAdminReports(this RouteGroupBuilder group)
    {
        // get all reports
        group.MapGet("/", async (IReportService reportService) =>
        {
            var reports = await reportService.GetAllReports();
            if (reports == null || !reports.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(reports);
        });

        // get report by id
        group.MapGet("/{id}", async (int id, IReportService reportService) =>
        {
            var report = await reportService.GetReportById(id);
            if (report == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(report);
        });

        // add report
        group.MapPost("/", async (Report report, IReportService reportService) =>
        {
            try
            {
                await reportService.AddReport(report);
                return Results.Created($"/reports/{report.Id}", report);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the report: {ex.Message}");
            }
        });

        // update report
        group.MapPut("/{id}", async (int id, Report report, IReportService reportService) =>
        {
            try
            {
                report.Id = id;
                await reportService.UpdateReport(report);
                return Results.Ok(report);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while updating the report: {ex.Message}");
            }
        });

        // delete report
        group.MapDelete("/{id}", async (int id, IReportService reportService) =>
        {
            try
            {
                await reportService.DeleteReport(id);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while deleting the report: {ex.Message}");
            }
        });

        return group;
    }
}