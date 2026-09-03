using backend.Data;
using backend.DTOs.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] string? categoryName,
            [FromQuery] string? search
        )
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrEmpty(categoryName))
            {
                query = query.Where(p => p.Category != null && p.Category.Name == categoryName);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    EF.Functions.Like(p.Title, $"%{search}%")
                    || EF.Functions.Like(p.Description, $"%{search}%")
                );
            }

            var products = await query.ToListAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CategoryName = p.Category?.Name,
                Price = p.Price,
                Image = p.Image,
                Stock = p.Stock,
            });
            return Ok(productDtos);
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context
                .Products.Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CategoryName = product.Category?.Name,
                Price = product.Price,
                Image = product.Image,
                Stock = product.Stock,
            };

            return Ok(productDto);
        }
    }
}
