using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebhookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly ICartService _cartService;

        public WebhookController(
            ApplicationDbContext context,
            IConfiguration config,
            ICartService cartService
        )
        {
            _context = context;
            _config = config;
            _cartService = cartService;
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var webhookSecret = _config["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    webhookSecret
                );
            }
            catch (StripeException)
            {
                return BadRequest();
            }

            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                var order = await _context
                    .Orders.Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.StripeSessionId == session.Id);

                if (order != null && order.Status != Models.OrderStatus.Paid)
                {
                    foreach (var item in order.Items)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product != null)
                        {
                            product.Stock -= item.Quantity;
                        }
                    }
                    order.Status = Models.OrderStatus.Paid;
                    await _cartService.ClearCartAsync(order.UserId);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok();
        }
    }
}
