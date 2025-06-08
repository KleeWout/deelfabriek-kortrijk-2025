

public static class AdminRoutes
{
    public static RouteGroupBuilder GroupAdminLockers(this RouteGroupBuilder group)
    {
        // get lockers
        group.MapGet("/", async (ILockerService lockerService) =>
        {
            var lockers = await lockerService.GetAllLockersWithItems();
            if (lockers == null || !lockers.Any())
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

        group.MapPost("/", async (
            Locker locker,
            ILockerService lockerService,
            IValidator<Locker> validator,
            IItemService itemService
        ) =>
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
        group.MapPut("/{id:int}", async (
            int id,
            Locker locker,
            ILockerService lockerService,
            IValidator<Locker> validator
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
        group.MapDelete("/{id}", async (int id, IItemService itemService) =>
        {
            var existingCategory = await itemService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return Results.NotFound();
            }

            try
            {
                await itemService.DeleteCategory(id);
                return Results.NoContent();
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

        return group;
    }

    public static RouteGroupBuilder GroupAdminItems(this RouteGroupBuilder group)
    {

        // get items for admin panel
        group.MapGet("/", async (IItemService itemService) =>
        {
            var items = await itemService.GetAllItemsAdmin();
            if (items == null || !items.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(items);
        });

        // post items
        group.MapPost("/", async (Item item, IItemService itemService, ItemValidator validator) =>
       {
           // Validate the item
           var validationResult = await validator.ValidateAsync(item);
           if (!validationResult.IsValid)
           {
               // Extract only the validation error messages
               var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
               return Results.BadRequest(warnings); // Return only the warnings
           }

           try
           {
               await itemService.AddItem(item);
               return Results.Created($"/items/{item.Id}", item);
           }
           catch (Exception ex)
           {
               return Results.Problem($"An error occurred while creating the item: {ex.Message}");
           }

       });

        group.MapPost("/upload", (IFormFile file) =>
         {
             using var reader = new StreamReader(file.OpenReadStream());
             var content = reader.ReadToEnd();
             var filePath = Path.GetFullPath("./Uploads/" + file.FileName);
             File.WriteAllText(filePath, content);
             return Results.Ok(content);

         }).DisableAntiforgery();
         
        // post item with image - works via postman 
        group.MapPost("/with-image", async (
              HttpRequest request,
              IItemService itemService,
              ItemValidator validator) =>
          {
              try
              {
                  var form = await request.ReadFormAsync();

                  // Extract item data from form using your actual model properties
                  var item = new Item
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
                      ImageSrc = "" // Set empty initially to pass validation
                  };

                  // Handle file upload first
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

                      // Now set the filename after upload
                      item.ImageSrc = fileName;
                  }

                  // Validate the item (now ImageSrc has a value if file was uploaded)
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
        //edit item
        group.MapPut("/{id}", async (int id, Item item, IItemService itemService, ItemValidator validator) =>
        {
            // Validate the item
            var validationResult = await validator.ValidateAsync(item);
            if (!validationResult.IsValid)
            {
                var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return Results.BadRequest(warnings);
            }

            var existingItem = await itemService.GetItemById(id);
            if (existingItem == null)
            {
                return Results.NotFound($"Item with ID {id} not found.");
            }

            // Set the ID to ensure we're updating the correct item
            item.Id = id;

            try
            {
                // Use the new method that handles categories properly
                await itemService.UpdateItemWithCategories(item);

                // Get the updated item to return
                var updatedItem = await itemService.GetItemById(id);
                return Results.Ok(updatedItem);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while updating the item: {ex.Message}");
            }
        });

        // delete item
        group.MapDelete("/{id}", async (int id, IItemService itemService) =>
        {
            var existingItem = await itemService.GetItemByIdDto(id);
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

  
        



        return group;
    }
}