using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context)
        {
            if (await context.Categories.AnyAsync() || await context.Products.AnyAsync())
            {
                return;
            }

            var categories = new List<Category>
            {
                new Category { Name = "Electronics" },
                new Category { Name = "Clothing" },
                new Category { Name = "Books" },
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            var products = new List<Product>
            {
                new Product
                {
                    Title = "Smartphone",
                    Price = 699.99m,
                    Description = "A high-end smartphone.",
                    CategoryId = categories[0].Id,
                    Stock = 50,
                },
                new Product
                {
                    Title = "Laptop",
                    Price = 1299.99m,
                    Description = "A powerful laptop.",
                    CategoryId = categories[0].Id,
                    Stock = 30,
                },
                new Product
                {
                    Title = "T-Shirt",
                    Price = 19.99m,
                    Description = "A comfortable t-shirt.",
                    CategoryId = categories[1].Id,
                    Stock = 100,
                },
                new Product
                {
                    Title = "Novel",
                    Price = 14.99m,
                    Description = "An engaging novel.",
                    CategoryId = categories[2].Id,
                    Stock = 75,
                },
                new Product
                {
                    Title = "Headphones",
                    Price = 99.99m,
                    Description = "Noise-cancelling headphones.",
                    CategoryId = categories[0].Id,
                    Stock = 0,
                },
            };
            context.Products.AddRange(products);
            await context.SaveChangesAsync();

            var passwordHasher = new PasswordHasher<User>();

            var users = new List<User>
            {
                new User
                {
                    Email = "admin@example.com",
                    Username = "admin",
                    PasswordHash = passwordHasher.HashPassword(null, "admin123"),
                    Role = UserRole.Admin,
                },
                new User
                {
                    Email = "user1@example.com",
                    Username = "user1",
                    PasswordHash = passwordHasher.HashPassword(null, "password1"),
                    Role = UserRole.User,
                },
            };
            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }
    }
}
