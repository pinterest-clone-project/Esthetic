using Application.Models.DTO.User;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Serialization;

namespace Application.UseCases.Account.Commands;

public record EditCommand : IRequest<TokenDTO>
{
    [BindNever]
    public Guid Id { get; init; }
    public string? FirstName { get; init; }

    public string? LastName { get; init; }

    public string? Email { get; init; }

    public string? Password { get; init; }

    public string? Bio { get; init; }

    [FromForm]
    public IFormFile? ImageFile { get; init; }
}
