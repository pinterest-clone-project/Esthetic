using Domain.Entities.Category;
using Domain.Entities.Identity;

namespace Domain.Entities;

public class UserCategory
{
    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public CategoryEntity Category { get; set; } = null!;
}