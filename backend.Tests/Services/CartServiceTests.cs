using backend.Data;
using backend.DTOs.Cart;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Services
{
    public class CartServiceTests
    {
        private readonly CartService _cartService;
        private readonly ApplicationDbContext _context;

        public CartServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _cartService = new CartService(_context);
        }

        // GetCartAsync tests
        [Fact]
        public async Task GetCartAsync_CartHasItems_ReturnsCartItems()
        {
            var category = new Category { Name = "Clothing" };
            var product1 = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            var product2 = new Product
            {
                Title = "Pants",
                Price = 15.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product1);
            _context.Products.Add(product2);
            await _context.SaveChangesAsync();

            var userId = 1;

            var cartItem1 = new CartItem
            {
                UserId = userId,
                ProductId = product1.Id,
                Quantity = 2,
            };
            var cartItem2 = new CartItem
            {
                UserId = userId,
                ProductId = product2.Id,
                Quantity = 1,
            };
            _context.CartItems.Add(cartItem1);
            _context.CartItems.Add(cartItem2);
            await _context.SaveChangesAsync();

            var result = await _cartService.GetCartAsync(userId);

            Assert.Equal(3, result.TotalItemCount);
            Assert.Equal(2, result.Items.Count);
            Assert.Equal(35.0m, result.Subtotal);
            Assert.Equal("Clothing", result.Items.First().ProductCategoryName);
        }

        [Fact]
        public async Task GetCartAsync_CartIsEmpty_ReturnsEmptyCart()
        {
            var userId = 1;
            var result = await _cartService.GetCartAsync(userId);

            Assert.Equal(0, result.TotalItemCount);
            Assert.Empty(result.Items);
            Assert.Equal(0.0m, result.Subtotal);
        }

        [Fact]
        public async Task GetCartAsync_MultipleUsers_DoNotShareCartItems()
        {
            var userId1 = 1;
            var userId2 = 2;

            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var cartItem = new CartItem
            {
                UserId = userId1,
                ProductId = product.Id,
                Quantity = 2,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            var result1 = await _cartService.GetCartAsync(userId1);
            var result2 = await _cartService.GetCartAsync(userId2);

            Assert.Equal(2, result1.TotalItemCount);

            Assert.Equal(0, result2.TotalItemCount);
            Assert.Empty(result2.Items);
        }

        // AddItemAsync tests
        [Fact]
        public async Task AddItemAsync_AddNewItem_ItemAddedToCart()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            var userId = 1;
            var quantity = 2;
            var dto = new AddCartItemDto { ProductId = product.Id, Quantity = quantity };

            await _cartService.AddItemAsync(userId, dto);
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.UserId == userId && ci.ProductId == product.Id
            );

            Assert.NotNull(cartItem);
            Assert.Equal(quantity, cartItem.Quantity);
        }

        [Fact]
        public async Task AddItemAsync_AddExistingItem_QuantityUpdated()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var userId = 1;
            var initialQuantity = 2;
            var additionalQuantity = 3;
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = product.Id,
                Quantity = initialQuantity,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            var dto = new AddCartItemDto { ProductId = product.Id, Quantity = additionalQuantity };
            await _cartService.AddItemAsync(userId, dto);

            var updatedCartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.UserId == userId && ci.ProductId == product.Id
            );

            Assert.NotNull(updatedCartItem);
            Assert.Equal(initialQuantity + additionalQuantity, updatedCartItem.Quantity);
        }

        // UpdateQuantityAsync tests
        [Fact]
        public async Task UpdateQuantityAsync_UpdatesQuantity()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var userId = 1;
            var initialQuantity = 2;
            var newQuantity = 5;
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = product.Id,
                Quantity = initialQuantity,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            var dto = new UpdateCartItemDto { Quantity = newQuantity };
            await _cartService.UpdateQuantityAsync(userId, cartItem.Id, dto);

            var updatedCartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.UserId == userId && ci.ProductId == product.Id
            );

            Assert.NotNull(updatedCartItem);
            Assert.Equal(newQuantity, updatedCartItem.Quantity);
        }

        [Fact]
        public async Task UpdateQuantityAsync_NonExistentCartItemId_ThrowsException()
        {
            var userId = 1;
            var CartItemId = 999;
            var dto = new UpdateCartItemDto { Quantity = 5 };
            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _cartService.UpdateQuantityAsync(userId, CartItemId, dto)
            );
        }

        [Fact]
        public async Task UpdateQuantityAsync_CartItemBelongsToAnotherUser_ThrowsException()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var userId1 = 1;
            var userId2 = 2;
            var cartItem = new CartItem
            {
                UserId = userId1,
                ProductId = product.Id,
                Quantity = 2,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            var dto = new UpdateCartItemDto { Quantity = 5 };

            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _cartService.UpdateQuantityAsync(userId2, cartItem.Id, dto)
            );
        }

        // RemoveItemAsync tests
        [Fact]
        public async Task RemoveItemAsync_RemovesItemFromCart()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            var userId = 1;
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = product.Id,
                Quantity = 2,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            await _cartService.RemoveItemAsync(userId, cartItem.Id);

            var removedCartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.UserId == userId && ci.ProductId == product.Id
            );
            Assert.Null(removedCartItem);
        }

        [Fact]
        public async Task RemoveItemAsync_NonExistentCartItemId_ThrowsException()
        {
            var userId = 1;
            var CartItemId = 999;
            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _cartService.RemoveItemAsync(userId, CartItemId)
            );
        }

        [Fact]
        public async Task RemoveItemAsync_CartItemBelongsToAnotherUser_ThrowsException()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var userId1 = 1;
            var userId2 = 2;
            var cartItem = new CartItem
            {
                UserId = userId1,
                ProductId = product.Id,
                Quantity = 2,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _cartService.RemoveItemAsync(userId2, cartItem.Id)
            );
        }

        // ClearCartAsync tests
        [Fact]
        public async Task ClearCartAsync_RemovesAllItemsFromCart()
        {
            var category = new Category { Name = "Clothing" };
            var product1 = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            var product2 = new Product
            {
                Title = "Pants",
                Price = 15.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product1);
            _context.Products.Add(product2);
            await _context.SaveChangesAsync();

            var userId = 1;
            var cartItem1 = new CartItem
            {
                UserId = userId,
                ProductId = product1.Id,
                Quantity = 2,
            };
            var cartItem2 = new CartItem
            {
                UserId = userId,
                ProductId = product2.Id,
                Quantity = 1,
            };
            _context.CartItems.Add(cartItem1);
            _context.CartItems.Add(cartItem2);
            await _context.SaveChangesAsync();
            await _cartService.ClearCartAsync(userId);

            var remainingCartItems = await _context
                .CartItems.Where(ci => ci.UserId == userId)
                .ToListAsync();

            Assert.Empty(remainingCartItems);
        }

        [Fact]
        public async Task ClearCartAsync_UserHasNoItems_OtherUsersCartUnaffected()
        {
            var category = new Category { Name = "Clothing" };
            var product = new Product
            {
                Title = "Shirt",
                Price = 10.0m,
                Category = category,
            };
            _context.Categories.Add(category);
            _context.Products.Add(product);

            await _context.SaveChangesAsync();
            var userId1 = 1;
            var userId2 = 2;
            var cartItem = new CartItem
            {
                UserId = userId2,
                ProductId = product.Id,
                Quantity = 2,
            };
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            await _cartService.ClearCartAsync(userId1);

            var remainingCartItemsForUser2 = await _context
                .CartItems.Where(ci => ci.UserId == userId2)
                .ToListAsync();
            Assert.Single(remainingCartItemsForUser2);
        }
    }
}
