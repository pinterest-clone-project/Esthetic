using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Users.Commands;

public record CreateUserCommand : IRequest<UserDTO>
{
    public string UserName { get; set; } = null!;
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
