using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models.SeedDTO;

public class UserSeedDTO
{
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}
