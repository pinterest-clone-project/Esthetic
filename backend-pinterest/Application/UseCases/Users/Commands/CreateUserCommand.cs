using Application.UseCases.Users.Responses;
using MediatR;

namespace Application.UseCases.Users.Commands;

public record CreateUserCommand : IRequest<UserResponse>
{
    public string UserName { get; set; } = null!;
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
