using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Account.Commands;

public record GoogleCommand : IRequest<TokenDTO>
{
    public string Token { get; init; } = string.Empty;
}