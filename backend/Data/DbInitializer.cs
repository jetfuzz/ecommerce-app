using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context, IConfiguration config)
        {
            // RESET: deletes table data and re-seeds on next run
            //await context.Orders.ExecuteDeleteAsync();
            //await context.Products.ExecuteDeleteAsync();
            //await context.Categories.ExecuteDeleteAsync();
            //await context.Users.ExecuteDeleteAsync();

            if (await context.Categories.AnyAsync() || await context.Products.AnyAsync())
            {
                return;
            }

            var categories = new List<Category>
            {
                new Category { Name = "Watches" },
                new Category { Name = "Bags" },
                new Category { Name = "Footwear" },
                new Category { Name = "Apparel" },
                new Category { Name = "Electronics" },
                new Category { Name = "Accessories" },
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            var products = new List<Product>
            {
                new Product
                {
                    Title = "Oversized Heavyweight Black Tee",
                    Price = 29.99m,
                    Description =
                        "Minimalist oversized black t-shirt made from heavy-cut cotton with dropped shoulders.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1789110854055-fc924935fd09?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 55,
                },
                new Product
                {
                    Title = "Sherpa-Lined Bomber Jacket",
                    Price = 149.99m,
                    Description =
                        "Navy blue zip-up bomber jacket with cozy white sherpa lining and ribbed wrist cuffs.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1624548140129-74786c5f1279?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 20,
                },
                new Product
                {
                    Title = "Striped Track Joggers - Grey",
                    Price = 54.99m,
                    Description =
                        "Light grey track pants with classic white side stripes and an adjustable drawstring waist.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1789110853719-2920fe512117?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 38,
                },
                new Product
                {
                    Title = "Essential Fleece Joggers - Red",
                    Price = 49.99m,
                    Description =
                        "Bright red fleece joggers with side slit pockets and a white drawstring closure.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1789110853644-4403e0f1e5fe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 33,
                },
            };

            var random = new Random();
            products = products.OrderBy(p => random.Next()).ToList();
            context.Products.AddRange(products);
            await context.SaveChangesAsync();

            var passwordHasher = new PasswordHasher<User>();

            var adminUser = new User
            {
                Email = config["SeedAdmin:Email"],
                Username = "admin",
                Role = UserRole.Admin,
            };
            adminUser.PasswordHash = passwordHasher.HashPassword(
                adminUser,
                config["SeedAdmin:Password"]
            );

            var defaultUser = new User
            {
                Email = config["SeedUser:Email"],
                Username = "user",
                Role = UserRole.User,
            };
            defaultUser.PasswordHash = passwordHasher.HashPassword(
                defaultUser,
                config["SeedUser:Password"]
            );

            var users = new List<User> { adminUser, defaultUser };
            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }
    }
}
