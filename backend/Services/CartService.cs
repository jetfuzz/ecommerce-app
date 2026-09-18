using backend.Data;
using backend.DTOs.Cart;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await _context
                .CartItems.Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                    .ThenInclude(p => p.Category)
                .ToListAsync();

            return new CartDto
            {
                Items = cart.Select(ci => new CartItemDto
                    {
                        Id = ci.Id,
                        ProductId = ci.ProductId,
                        ProductTitle = ci.Product.Title,
                        ProductImage = ci.Product.Image,
                        ProductCategoryName = ci.Product.Category?.Name,
                        ProductPrice = ci.Product.Price,
                        Quantity = ci.Quantity,
                    })
                    .ToList(),
                Subtotal = cart.Sum(ci => ci.Quantity * ci.Product.Price),
                TotalItemCount = cart.Sum(ci => ci.Quantity),
            };
        }

        public async Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto)
        {
            var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);

            if (!productExists)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            var existingCartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.UserId == userId && ci.ProductId == dto.ProductId
            );

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += dto.Quantity;
            }
            else
            {
                var newCartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                };
                _context.CartItems.Add(newCartItem);
            }
            await _context.SaveChangesAsync();
            return await GetCartAsync(userId);
        }

        public async Task<CartDto> UpdateQuantityAsync(
            int userId,
            int itemId,
            UpdateCartItemDto dto
        )
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.Id == itemId && ci.UserId == userId
            );

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Item not found in cart.");
            }

            cartItem.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();
            return await GetCartAsync(userId);
        }

        public async Task<CartDto> RemoveItemAsync(int userId, int itemId)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                ci.Id == itemId && ci.UserId == userId
            );

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Item not found in cart.");
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return await GetCartAsync(userId);
        }

        public async Task ClearCartAsync(int userId)
        {
            var cartItems = await _context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }
    }
}
