using backend.Data;
using backend.DTOs.Product;
using backend.Models;
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
                    EF.Functions.ILike(p.Title, $"%{search}%")
                    || EF.Functions.ILike(p.Description, $"%{search}%")
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

            var dto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CategoryName = product.Category?.Name,
                Price = product.Price,
                Image = product.Image,
                Stock = product.Stock,
            };

            return Ok(dto);
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(
            int id,
            [FromBody] CreateProductDto createProductDto
        )
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var category = await _context.Categories.FindAsync(createProductDto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid CategoryId" });
            }

            product.Title = createProductDto.Title;
            product.Price = createProductDto.Price;
            product.Description = createProductDto.Description;
            product.CategoryId = createProductDto.CategoryId;
            product.Image = createProductDto.Image;
            product.Stock = createProductDto.Stock;

            await _context.SaveChangesAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CategoryName = category.Name,
                Price = product.Price,
                Image = product.Image,
                Stock = product.Stock,
            };

            return Ok(productDto);
        }

        // POST: api/Product
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(
            [FromBody] CreateProductDto createProductDto
        )
        {
            var category = await _context.Categories.FindAsync(createProductDto.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid CategoryId" });
            }
            var product = new Product
            {
                Title = createProductDto.Title,
                Price = createProductDto.Price,
                Description = createProductDto.Description,
                CategoryId = createProductDto.CategoryId,
                Image = createProductDto.Image,
                Stock = createProductDto.Stock,
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            var dto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CategoryName = category.Name,
                Price = product.Price,
                Image = product.Image,
                Stock = product.Stock,
            };
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, dto);
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
