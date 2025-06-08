using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Mvc;

public static class PublicRoutes
{
    public static RouteGroupBuilder GroupPublicUsers(this RouteGroupBuilder group)
    {
        // get users
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

        // post user
        // create user
        group.MapPost("/", async (User user, IUserService userService, UserValidator userValidator) =>
        {
            // Create validation context for CREATE operation
            var validationContext = new ValidationContext<User>(user);
            validationContext.RootContextData["Operation"] = "CREATE";

            // Validate with context (will include email existence check)
            var validationResult = await userValidator.ValidateAsync(validationContext);
            if (!validationResult.IsValid)
            {
                // Extract only the validation error messages
                var warnings = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return Results.BadRequest(warnings); // Return only the warnings
            }

            try
            {
                await userService.AddUser(user);
                return Results.Created($"/users/{user.Id}", user);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the user: {ex.Message}");
            }
        });
        // edit user
        // edit user
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

    // group items 
    public static RouteGroupBuilder GroupPublicItems(this RouteGroupBuilder group)
    {

        group.MapGet("/", async (int? categoryId, IItemService itemService) =>
        {
            // if (categoryId.HasValue)
            // {
            //     Console.WriteLine($"Filtering by categoryId: {categoryId.Value}");
            //     var items = await itemService.GetItemsByCategoryAsync(categoryId.Value);
            //     Console.WriteLine($"Found {items.Count} items for category {categoryId.Value}");
            //     return items.Any() ? Results.Ok(items) : Results.NotFound($"No items found for category {categoryId.Value}");
            // }

            var allItems = await itemService.GetAllItemsPage();
            if (allItems == null || !allItems.Any())
            {
                return Results.NotFound("No items found");
            }
            return Results.Ok(allItems);
        });


        group.MapGet("/available", async (IItemService itemService) =>
        {
            var items = await itemService.GetAvailableItems();

            if (items == null || !items.Any())
            {
                return Results.NotFound();
            }

            return Results.Ok(items);
        });

        // Parameterized route last
        // group.MapGet("/{id:int}", async (int id, IItemService itemService) =>
        // {
        //     var item = await itemService.GetItemByIdDto(id);
        //     if (item == null)
        //     {
        //         return Results.NotFound();
        //     }
        //     return Results.Ok(item);
        // });
         //get all items that are in lockers
        group.MapGet("/lockers", async (IItemService itemService) =>
        {
            var items = await itemService.GetItemsWithLocker();
            return Results.Ok(items);

        });



        return group;
    }

    public static RouteGroupBuilder GroupReservations(this RouteGroupBuilder group)
    {
        // Implement reservation routes here
        // e.g., group.MapGet("/reservations", ...);
        group.MapPost("/", async (CreateReservationDto dto, IReservationService reservationService) =>
        {
            try
            {
                var reservation = await reservationService.CreateReservation(dto);
                return Results.Ok(new { ReservationId = reservation.Id }); // Only return the ID
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while creating the reservation: {ex.Message}");
            }
        });

        group.MapGet("/{id:int}", async (int id, IReservationService reservationService) =>
        {
            var reservation = await reservationService.GetReservationbyId(id);
            if (reservation == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(reservation);
        });

        return group;
    }

    public static RouteGroupBuilder GroupPublicCategories(this RouteGroupBuilder group)
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

        return group;
    }
    public static RouteGroupBuilder GroupPublicOpeningHours(this RouteGroupBuilder group)
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
        return group;
    }
}