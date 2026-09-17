using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICartService _cartService;
        private readonly IConfiguration _configuration;
        private readonly SessionService _sessionService;

        public CheckoutController(
            ApplicationDbContext context,
            ICartService cartService,
            IConfiguration configuration,
            SessionService sessionService
        )
        {
            _context = context;
            _cartService = cartService;
            _configuration = configuration;
            _sessionService = sessionService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var cart = await _cartService.GetCartAsync(userId);

            if (cart.Items.Count == 0)
            {
                return BadRequest("Cart is empty.");
            }

            foreach (var item in cart.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null || product.Stock < item.Quantity)
                {
                    return BadRequest(
                        $"'{item.ProductTitle}' is out of stock or has insufficient quantity."
                    );
                }
            }

            var order = new Order
            {
                UserId = userId,
                Status = OrderStatus.Pending,
                TotalAmount = cart.Subtotal,
                CreatedAt = DateTime.UtcNow,
                Items = cart
                    .Items.Select(item => new OrderItem
                    {
                        ProductId = item.ProductId,
                        ProductTitle = item.ProductTitle,
                        Quantity = item.Quantity,
                        Price = item.ProductPrice,
                    })
                    .ToList(),
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = cart
                    .Items.Select(item => new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "cad",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = item.ProductTitle,
                            },
                            UnitAmount = (long)(item.ProductPrice * 100),
                        },
                        Quantity = item.Quantity,
                    })
                    .ToList(),
                Mode = "payment",
                SuccessUrl =
                    $"{_configuration["Frontend:BaseUrl"]}/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{_configuration["Frontend:BaseUrl"]}/cart",
            };

            Session session = await _sessionService.CreateAsync(options);

            order.StripeSessionId = session.Id;
            await _context.SaveChangesAsync();

            return Ok(new { url = session.Url });
        }
    }
}
