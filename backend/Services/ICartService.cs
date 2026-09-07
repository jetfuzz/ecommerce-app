using backend.DTOs.Cart;

namespace backend.Services
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto);
        Task<CartDto> UpdateQuantityAsync(int userId, int itemId, UpdateCartItemDto dto);
        Task<CartDto> RemoveItemAsync(int userId, int itemId);
        Task ClearCartAsync(int userId);
    }
}
