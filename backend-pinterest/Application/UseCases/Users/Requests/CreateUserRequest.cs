using System;

namespace Application.UseCases.Users.Requests;

public class CreateUserRequest
{
    public string UserName { get; set; } = null!;
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
