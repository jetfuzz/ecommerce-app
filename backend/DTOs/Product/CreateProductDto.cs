using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Product
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive value")]
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be a positive integer")]
        public int CategoryId { get; set; }
        public string? Image { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be a positive integer")]
        public int Stock { get; set; }
    }
}
