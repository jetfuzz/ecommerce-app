using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Category
{
    public class CreateCategoryDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
