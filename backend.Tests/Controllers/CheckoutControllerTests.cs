using System.Security.Claims;
using backend.Controllers;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Newtonsoft.Json.Linq;
using Stripe.Checkout;

namespace backend.Tests.Controllers
{
    public class CheckoutControllerTests
    {
        private const int TestUserId = 1;
        private readonly CheckoutController _controller;
        private readonly ICartService _cartService;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly Mock<SessionService> _mockSessionService;

        public CheckoutControllerTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _cartService = new CartService(_context);
            _config = new ConfigurationBuilder().Build();
            _mockSessionService = new Mock<SessionService>();

            _controller = new CheckoutController(
                _context,
                _cartService,
                _config,
                _mockSessionService.Object
            )
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(
                            new ClaimsIdentity(
                                new[]
                                {
                                    new Claim(ClaimTypes.NameIdentifier, TestUserId.ToString()),
                                },
                                "TestAuth"
                            )
                        ),
                    },
                },
            };
        }

        [Fact]
        public async Task CreateCheckoutSession_EmptyCart_ReturnsBadRequest()
        {
            var result = await _controller.CreateCheckoutSession();

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateCheckoutSession_InsufficientStock_ReturnsBadRequest()
        {
            _context.Categories.Add(new Category { Id = 1, Name = "Category" });
            _context.Products.Add(
                new Product
                {
                    Id = 1,
                    Title = "Product",
                    Price = 10m,
                    Description = "",
                    CategoryId = 1,
                    Stock = 1,
                }
            );
            _context.CartItems.Add(
                new CartItem
                {
                    UserId = TestUserId,
                    ProductId = 1,
                    Quantity = 3,
                }
            );
            await _context.SaveChangesAsync();

            var result = await _controller.CreateCheckoutSession();

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateCheckoutSession_HappyPath()
        {
            _context.Categories.Add(new Category { Id = 1, Name = "Category" });
            _context.Products.Add(
                new Product
                {
                    Id = 1,
                    Title = "Product",
                    Price = 10m,
                    Description = "",
                    CategoryId = 1,
                    Stock = 5,
                }
            );
            _context.CartItems.Add(
                new CartItem
                {
                    UserId = TestUserId,
                    ProductId = 1,
                    Quantity = 3,
                }
            );
            await _context.SaveChangesAsync();

            var session = new Session
            {
                Id = "session_id",
                Url = "https://checkout.stripe.com/pay/session_id",
            };

            _mockSessionService
                .Setup(s => s.CreateAsync(It.IsAny<SessionCreateOptions>(), null, default))
                .ReturnsAsync(session);

            var result = await _controller.CreateCheckoutSession();
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.UserId == TestUserId);

            var value = Assert.IsType<OkObjectResult>(result).Value;
            var url = value.GetType().GetProperty("url")?.GetValue(value) as string;
            Assert.Equal(session.Url, url);
            Assert.NotNull(order);
            Assert.Equal(session.Id, order.StripeSessionId);
        }
    }
}
