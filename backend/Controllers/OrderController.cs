using System.Security.Claims;
using backend.Data;
using backend.DTOs.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        int userId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _context
                .Orders.Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var dto = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                CreatedAt = o.CreatedAt,
                Items = o
                    .Items.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductTitle = oi.ProductTitle,
                        ProductImage = oi.ProductImage,
                        Quantity = oi.Quantity,
                        PriceAtPurchase = oi.Price,
                    })
                    .ToList(),
            });

            return Ok(dto);
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _context
                .Orders.Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return NotFound();
            }

            var dto = new OrderDto
            {
                Id = order.Id,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Items = order
                    .Items.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductTitle = oi.ProductTitle,
                        ProductImage = oi.ProductImage,
                        Quantity = oi.Quantity,
                        PriceAtPurchase = oi.Price,
                    })
                    .ToList(),
            };

            return Ok(dto);
        }
    }
}
