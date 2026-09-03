namespace backend.DTOs.Product
{
    public class CreateProductDto
    {
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? Image { get; set; }
        public int Stock { get; set; }
    }
}
