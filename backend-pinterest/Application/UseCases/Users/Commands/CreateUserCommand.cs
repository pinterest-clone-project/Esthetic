using Application.Interfaces.Caching;
using Application.Models.DTO.User;
using Domain.Constants;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Users.Commands;

public record CreateUserCommand : IRequest<UserDTO>, ICacheInvalidator
{
    public string UserName { get; set; } = null!;
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? BirthDate { get; set; }

    [BindNever]
    public IReadOnlyList<string> CacheKeysInvalidators =>
    [
        CacheKeys.AllUsers,
    ];
}
