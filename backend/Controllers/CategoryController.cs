using backend.Data;
using backend.DTOs.Category;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            var dto = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
            });

            return Ok(dto);
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            var dto = new CategoryDto { Id = category.Id, Name = category.Name };

            return Ok(dto);
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(
            int id,
            [FromBody] CreateCategoryDto createCategoryDto
        )
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            var exists = await _context.Categories.AnyAsync(c => c.Name == createCategoryDto.Name && c.Id != id);
            if (exists)
                return BadRequest(new { message = "A category with this name already exists" });

            category.Name = createCategoryDto.Name;

            await _context.SaveChangesAsync();

            var dto = new CategoryDto { Id = category.Id, Name = category.Name };

            return Ok(dto);
        }

        // POST: api/Category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(
            [FromBody] CreateCategoryDto createCategoryDto
        )
        {
            var exists = await _context.Categories.AnyAsync(c => c.Name == createCategoryDto.Name);
            if (exists)
                return BadRequest(new { message = "A category with this name already exists" });

            var category = new Category { Name = createCategoryDto.Name };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var dto = new CategoryDto { Id = category.Id, Name = category.Name };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, dto);
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                return BadRequest(
                    new
                    {
                        message = "Cannot delete a category that still has products assigned to it.",
                    }
                );
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
