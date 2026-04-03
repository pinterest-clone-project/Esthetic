using Application.Models.DTO.User;
using MediatR;

namespace Application.UseCases.Account.Commands;

public record RefreshCommand : IRequest<TokenDTO>
{
    public string RefreshToken { get; set; } = string.Empty;
}
