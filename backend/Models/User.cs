namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
        public List<CartItem> CartItems { get; set; } = new List<CartItem>();
        public List<Order> Orders { get; set; } = new List<Order>();
    }

    public enum UserRole
    {
        Admin,
        User,
        Demo,
    }
}
