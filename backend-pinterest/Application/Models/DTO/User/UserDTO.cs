using Domain.Enums;

namespace Application.Models.DTO.User;

public class UserDTO
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public Gender? Gender { get; set; }
    public string? Image { get; set; }
    public bool IsPrivate { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public IList<string> Roles { get; set; } = [];
}
