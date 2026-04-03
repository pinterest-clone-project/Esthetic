using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Account.Commands;

public record LoginCommand : IRequest<TokenDTO>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}