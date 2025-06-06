using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Deelkast.API.Models;

namespace Deelkast.API.Context
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Locker> Lockers { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<OpeningHour> OpeningHours { get; set; } // was OpeningUren
        public DbSet<Report> Reports { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many: ItemCategory
            modelBuilder.Entity<ItemCategory>()
                .HasKey(ic => new { ic.ItemId, ic.CategoryId });

            modelBuilder.Entity<ItemCategory>()
                .HasOne(ic => ic.Item)
                .WithMany(i => i.ItemCategories)
                .HasForeignKey(ic => ic.ItemId);

            modelBuilder.Entity<ItemCategory>()
                .HasOne(ic => ic.Category)
                .WithMany(c => c.ItemCategories)
                .HasForeignKey(ic => ic.CategoryId);

            // One-to-One: Item - Locker
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Locker)
                .WithOne(l => l.Item)
                .HasForeignKey<Locker>(l => l.ItemId)
                .OnDelete(DeleteBehavior.SetNull);

            // Reservation - Item (Many-to-One)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Item)
                .WithMany()
                .HasForeignKey(r => r.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Reservation - User (Many-to-One)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Reservation - Locker (Many-to-One)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Locker)
                .WithMany()
                .HasForeignKey(r => r.LockerId)
                .OnDelete(DeleteBehavior.SetNull);

            // Item Status as string
            modelBuilder.Entity<Item>()
                .Property(i => i.Status)
                .HasConversion<string>();

            // Rapport - Reservation (Many-to-One)
            modelBuilder.Entity<Report>()
                .HasOne(r => r.Reservation)
                .WithMany()
                .HasForeignKey(r => r.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Rapport - Review (Many-to-One)

            // OpeningHour PK
            modelBuilder.Entity<OpeningHour>() // was OpeningUren
                .HasKey(o => o.DayId); // was IdDay

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Elektrisch", IconName = "electricity" },
                new Category { Id = 2, Name = "Speelgoed", IconName = "toy" },
                new Category { Id = 3, Name = "Tuingereedschap", IconName = "garden-tools" },
                new Category { Id = 4, Name = "Keukenapparatuur", IconName = "kitchen-appliances" }
            );

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    PhoneNumber = "123456789",
                    Email = "john@example.com",
                    IsAdmin = false,
                    IsBlocked = false,
                    TotalFine = 0,
                    CreatedAt = new DateTime(2023, 6, 5),
                    Street = "Hoofdstraat 1",
                    City = "Amsterdam",
                    Bus = "A",
                    PostalCode = "1012AB",
                }
            );

            // Seed Items
            modelBuilder.Entity<Item>().HasData(
            new Item
            {
                Id = 1,
                Title = "Naaimachine",
                PricePerWeek = 5.00m,
                Status = ItemStatus.Beschikbaar,
                TimesLoaned = 0,
                Accesories = "4 spoeltjes",
                Weight = null,
                Dimensions = null,
                CreatedAt = new DateTime(2023, 6, 5)
            },
            new Item
            {
                Id = 2,
                Title = "Schroef- en Klopboormachine",
                Description = "Uiterst geschikt voor allround (klop)boor- en schroefwerkzaamheden. 3 functies: schroeven, boren en klopboren. Hoog werkcomfort door uitstekende machinebalans en compact formaat.",
                PricePerWeek = 5.00m,
                Status = ItemStatus.Beschikbaar,
                ImageSrc = "https://shop.lecot.be/nl-be/makita-accu-schroef-en-klopboormachine-dhp485rfj-18v-2-x-3-ah-li-ion",
                TimesLoaned = 0,
                HowToUse = "Zie handleiding: https://www.icmsmakita.eu/cms/custom/nl/attachments/user_manual/DHP485_20240320_885653D991_DU884.pdf",
                Accesories = "1x 18 V Klopboor-/schroefmachine, 2x 3.0 Ah accu, 1x Snellader, 1x Mbox",
                Weight = 1.5m,
                CreatedAt = new DateTime(2023, 6, 5)
            },
            new Item
            {
                Id = 3,
                Title = "Gardena tuinslang 20m",
                Description = "GARDENA Comfort FLEX slang met Original accessoires. Drukbestendig, vormvast, knikt en verdraait niet.",
                PricePerWeek = 2.00m,
                Status = ItemStatus.Beschikbaar,
                ImageSrc = "https://www.hubo.be/nl/p/gardena-flex-tuinslang-13mm-1-2-20m-accessoires/509258/",
                TimesLoaned = 0,
                Accesories = "1 x kraanstuk, 1 x adapter, 1 x slangstuk, 1 x waterstop, 1 x tuinspuit",
                Weight = null,
                Dimensions = null,
                CreatedAt = new DateTime(2023, 6, 5)
            },
            new Item
            {
                Id = 4,
                Title = "Verlengdraad",
                Description = "25 meter snoerlengte. Geschikt voor buiten. 230 voltage. 4 stopcontacten.",
                PricePerWeek = 10.00m,
                Status = ItemStatus.Beschikbaar,
                TimesLoaned = 0,
                HowToUse = "Vergeet niet: de verlengkabel moet je volledig afrollen. Zo voorkom je oververhitting van de kabel.",
                Accesories = "/",
                Weight = 7.9m,
                Dimensions = "44 x 29.7 cm",
                CreatedAt = new DateTime(2023, 6, 5)
            },
            new Item
            {
                Id = 5,
                Title = "Ijsmachine",
                Description = "Zelf ijs maken. Geschikt voor roomijs en sorbet. Inhoud 1,5 liter.",
                PricePerWeek = 5.00m,
                Status = ItemStatus.Beschikbaar,
                ImageSrc = "https://www.coolblue.be/nl/product/172042/cuisinart-de-luxe-ice30bce.html",
                TimesLoaned = 0,
                HowToUse = "De ijsemmer moet eerst een nachtje in de vriezer. De vrieskom moet volledig bevroren zijn. Kan 6-22 uur duren afhankelijk van de vriezer.",
                Accesories = "Vrieskom, Spatel",
                Weight = 7.0m,
                Dimensions = "41 x 24 cm",
                Tip = "Controleer of de kom (20 x 16.5 cm) in je vriezer past.",
                CreatedAt = new DateTime(2023, 6, 5)
            }

            );



            // Seed ItemCategory (join table)
            modelBuilder.Entity<ItemCategory>().HasData(
                new ItemCategory { ItemId = 1, CategoryId = 1 }, // Boormachine → Elektrisch
                new ItemCategory { ItemId = 2, CategoryId = 2 }, // Houten trein → Speelgoed
                new ItemCategory { ItemId = 2, CategoryId = 3 }  // Houten trein → Tuingereedschap
            );
            // Seed Lockers
            modelBuilder.Entity<Locker>().HasData(
                new Locker
                {
                    Id = 1,
                    LockerNumber = 101,
                    IsOpen = true,
                    ItemId = null // Geen item toegewezen
                },
                new Locker
                {
                    Id = 2,
                    LockerNumber = 102,
                    IsOpen = true,
                    ItemId = null // Geen item toegewezen
                }
            );

            // Seed Reservations
            modelBuilder.Entity<Reservation>().HasData(
                new Reservation
                {
                    Id = 1,
                    PickupCode = "123456",
                    ReservationDate = new DateTime(2023, 6, 5),
                    LoanStart = null,
                    LoanEnd = null,
                    ActualReturnDate = null,
                    Weeks = 1,
                    PickupDeadline = new DateTime(2023, 6, 7),
                    TotalPrice = 5.00m,
                    UserId = 1,
                    ItemId = 1,
                    LockerId = 1
                }
            );

            // Seed Opening Hours
            modelBuilder.Entity<OpeningHour>().HasData(
                new OpeningHour
                {
                    DayId = "Maandag",
                    OpenTimeMorning = TimeSpan.Parse("08:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = TimeSpan.Parse("13:00"),
                    CloseTimeAfternoon = TimeSpan.Parse("17:00"),
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Dinsdag",
                    OpenTimeMorning = TimeSpan.Parse("08:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = TimeSpan.Parse("13:00"),
                    CloseTimeAfternoon = TimeSpan.Parse("17:00"),
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Woensdag",
                    OpenTimeMorning = TimeSpan.Parse("08:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = TimeSpan.Parse("13:00"),
                    CloseTimeAfternoon = TimeSpan.Parse("17:00"),
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Donderdag",
                    OpenTimeMorning = TimeSpan.Parse("08:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = TimeSpan.Parse("13:00"),
                    CloseTimeAfternoon = TimeSpan.Parse("17:00"),
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Vrijdag",
                    OpenTimeMorning = TimeSpan.Parse("08:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = TimeSpan.Parse("13:00"),
                    CloseTimeAfternoon = TimeSpan.Parse("17:00"),
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Zaterdag",
                    OpenTimeMorning = TimeSpan.Parse("09:00"),
                    CloseTimeMorning = TimeSpan.Parse("12:00"),
                    OpenTimeAfternoon = null,
                    CloseTimeAfternoon = null,
                    Open = true
                },
                new OpeningHour
                {
                    DayId = "Zondag",
                    OpenTimeMorning = null,
                    CloseTimeMorning = null,
                    OpenTimeAfternoon = null,
                    CloseTimeAfternoon = null,
                    Open = false
                }
            );
            // review seed

            modelBuilder.Entity<Report>().HasData(
                new Report
                {
                    Id = 1,
                    ReservationId = 1,
                    Rating = 3,
                    Remark = "Slecht, niet goed",
                    Status = false,
                    CreatedAt = new DateTime(2023, 6, 5),
                }
            );
        }
    }
}
