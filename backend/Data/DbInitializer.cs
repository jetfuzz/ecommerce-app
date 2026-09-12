using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context, IConfiguration config)
        {
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
                    Title = "Midnight Sport Watch",
                    Price = 349.99m,
                    Description =
                        "Sleek black smartwatch with an angled digital display and a soft-touch silicone band built for daily wear.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1637160151663-a410315e4e75?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 24,
                },
                new Product
                {
                    Title = "Ember Face Smartwatch",
                    Price = 379.99m,
                    Description =
                        "Matte black smartwatch featuring a vibrant flame-inspired face and comfortable black silicone strap.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 18,
                },
                new Product
                {
                    Title = "Champagne Mesh Smartwatch",
                    Price = 329.99m,
                    Description =
                        "Refined smartwatch fitted with a breathable fabric loop band in a neutral champagne tone.",
                    CategoryId = categories[0].Id,
                    Image =
                        "https://images.unsplash.com/photo-1786103776067-2df6237af61d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 21,
                },
                new Product
                {
                    Title = "Heritage Leather Backpack",
                    Price = 189.99m,
                    Description =
                        "Full-grain leather backpack featuring a spacious main compartment, zipped front pouch, and dual side pockets.",
                    CategoryId = categories[1].Id,
                    Image =
                        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 15,
                },
                new Product
                {
                    Title = "Colorblock Retro Trainers",
                    Price = 129.99m,
                    Description =
                        "Chunky street-style sneakers built with colorful paneled uppers, white midsoles, and red accent laces.",
                    CategoryId = categories[2].Id,
                    Image =
                        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 32,
                },
                new Product
                {
                    Title = "Lucky Cat Graphic Tee",
                    Price = 34.99m,
                    Description =
                        "Relaxed-fit cotton tee in sand featuring a framed Maneki-neko graphic print on the front.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 60,
                },
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
                new Product
                {
                    Title = "Floral Wide-Leg Trousers",
                    Price = 64.99m,
                    Description =
                        "Relaxed-fit wide-leg trousers in sage green with a delicate botanical line-art print.",
                    CategoryId = categories[3].Id,
                    Image =
                        "https://images.unsplash.com/photo-1789110854083-ae8c8ad4086f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 27,
                },
                new Product
                {
                    Title = "Polaroid Instant Camera",
                    Price = 119.99m,
                    Description =
                        "Vintage black Polaroid instant camera with classic rainbow badge and integrated flash.",
                    CategoryId = categories[4].Id,
                    Image =
                        "https://images.unsplash.com/photo-1516962126636-27ad087061cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 12,
                },
                new Product
                {
                    Title = "Custom 65% Mechanical Keyboard",
                    Price = 139.99m,
                    Description =
                        "Compact mechanical keyboard featuring custom keycaps and a coiled USB cable.",
                    CategoryId = categories[4].Id,
                    Image =
                        "https://images.unsplash.com/photo-1617096819670-6de2869bbd2e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 26,
                },
                new Product
                {
                    Title = "Classic Handheld Console",
                    Price = 89.99m,
                    Description =
                        "Original grey handheld gaming unit with monochrome screen, classic cross D-pad, and red action buttons.",
                    CategoryId = categories[4].Id,
                    Image =
                        "https://images.unsplash.com/photo-1703319952271-a72d8995c336?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 14,
                },
                new Product
                {
                    Title = "Vintage 35mm Film SLR Camera",
                    Price = 249.99m,
                    Description =
                        "Classic manual 35mm SLR camera body in silver and black finish with center viewfinder.",
                    CategoryId = categories[4].Id,
                    Image =
                        "https://images.unsplash.com/photo-1783265110412-cb699d435cca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 9,
                },
                new Product
                {
                    Title = "Everyday Carry Essentials Set",
                    Price = 119.99m,
                    Description =
                        "Matching EDC bundle featuring a slim brown leather snap wallet and round wire-frame glasses.",
                    CategoryId = categories[5].Id,
                    Image =
                        "https://images.unsplash.com/photo-1755719401891-327552d72892?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    Stock = 18,
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
