using backend.DTOs.Cart;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        int userId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<ActionResult<CartDto>> AddCartItem([FromBody] AddCartItemDto dto)
        {
            var cart = await _cartService.AddItemAsync(userId, dto);
            return Ok(cart);
        }

        [HttpPut("items/{itemId}")]
        public async Task<ActionResult<CartDto>> UpdateCartItem(
            int itemId,
            [FromBody] UpdateCartItemDto dto
        )
        {
            var cart = await _cartService.UpdateQuantityAsync(userId, itemId, dto);
            return Ok(cart);
        }

        [HttpDelete("items/{itemId}")]
        public async Task<ActionResult<CartDto>> RemoveCartItem(int itemId)
        {
            var cart = await _cartService.RemoveItemAsync(userId, itemId);
            return Ok(cart);
        }
    }
}
