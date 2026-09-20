namespace backend.DTOs.Cart
{
    public class CartDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal Subtotal { get; set; }
        public int TotalItemCount { get; set; }
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductTitle { get; set; } = string.Empty;
        public string? ProductImage { get; set; }
        public string? ProductCategoryName { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public int ProductStock { get; set; }
    }
}
