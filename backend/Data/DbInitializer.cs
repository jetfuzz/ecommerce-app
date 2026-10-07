using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context, IConfiguration config)
        {
            // RESET: deletes table data for re-seed on next run
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
                new Category { Name = "Outerwear" },
                new Category { Name = "Tops" },
                new Category { Name = "Bottoms" },
                new Category { Name = "Accessories" },
                new Category { Name = "Footwear" },
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            var products = new List<Product>
            {
                new Product
                {
                    Title = "Padded Bomber Jacket",
                    Price = 125.00m,
                    Description =
                        "Warm, padded bomber with a sherpa-lined collar for cold-weather days.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1624548140129-74786c5f1279?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 20,
                },
                new Product
                {
                    Title = "Half-Zip Anorak",
                    Price = 135.00m,
                    Description =
                        "Lightweight anorak with a hood and front pocket for wet, windy days.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1611308725032-74f0a551d018?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 3,
                },
                new Product
                {
                    Title = "Insulated Hooded Jacket",
                    Price = 165.00m,
                    Description =
                        "Insulated jacket with a sherpa-lined hood and chest pocket for cold-weather wear.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1624548140150-108c3287f551?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 9,
                },
                new Product
                {
                    Title = "Crew Neck Tee",
                    Price = 30.00m,
                    Description = "Soft, classic-fit tee for everyday wear.",
                    CategoryId = categories[1].Id,
                    Image =
                        "https://images.unsplash.com/photo-1778671394516-8270eac13c42?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 30,
                },
                new Product
                {
                    Title = "Flap-Top Backpack",
                    Price = 90.00m,
                    Description =
                        "Durable backpack with buckle straps and side pockets for hiking and daily carry.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1621624959365-071359461b94?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 4,
                },
                new Product
                {
                    Title = "Patch Beanie",
                    Price = 28.00m,
                    Description = "Warm cuffed knit beanie with a logo patch for cold days.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 25,
                },
                new Product
                {
                    Title = "Chest Logo Tee",
                    Price = 38.00m,
                    Description =
                        "Soft, short-sleeve tee with a small chest logo for everyday wear.",
                    CategoryId = categories[1].Id,
                    Image =
                        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 18,
                },
                new Product
                {
                    Title = "Long Sleeve Tee",
                    Price = 42.00m,
                    Description = "Soft long-sleeve tee with a small chest print for layering.",
                    CategoryId = categories[1].Id,
                    Image =
                        "https://images.unsplash.com/photo-1618354691551-44de113f0164?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 0,
                },
                new Product
                {
                    Title = "Embroidered Beanie",
                    Price = 30.00m,
                    Description = "Warm cuffed knit beanie with an embroidered star logo.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1633964124833-f4f3928c55bb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 20,
                },
                new Product
                {
                    Title = "Steel Water Bottle",
                    Price = 32.00m,
                    Description =
                        "Stainless steel water bottle with a sport cap for the gym, trail and commute.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1618354691249-18772bbac3a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 26,
                },
                new Product
                {
                    Title = "Cargo Joggers",
                    Price = 45.00m,
                    Description =
                        "Relaxed joggers with cargo pockets and an elastic drawstring waist for everyday wear.",
                    CategoryId = categories[2].Id,
                    Image =
                        "https://images.unsplash.com/photo-1789110519605-c5ceeeab5a0f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 11,
                },
                new Product
                {
                    Title = "Waterproof Trail Shoes",
                    Price = 140.00m,
                    Description =
                        "Waterproof trail shoes with a grippy outsole for wet, uneven terrain.",
                    CategoryId = categories[4].Id,
                    Image =
                        "https://images.unsplash.com/photo-1582898967731-b5834427fd66?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 8,
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

            var demoUser = new User
            {
                Email = "demo@zenith.com",
                Username = "demo",
                Role = UserRole.Demo,
            };
            demoUser.PasswordHash = passwordHasher.HashPassword(
                demoUser,
                "demodemo"
            );

            var users = new List<User> { adminUser, defaultUser, demoUser };
            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }
    }
}
