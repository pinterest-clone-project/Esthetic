using Application.Interfaces.Transaction;
using Application.Models.DTO.User;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.UseCases.Account.Commands;

public record RegisterCommand : IRequest<TokenDTO>, ITransactionalCommand
{
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public Gender? Gender { get; set; } = null;
    public string? Country { get; set; } = string.Empty;
    public string? Language { get; set; } = string.Empty;
    public IList<Guid>? CategoryIds { get; set; } = null;
    [FromForm]
    public IFormFile? ImageFile { get; set; } = null;
}