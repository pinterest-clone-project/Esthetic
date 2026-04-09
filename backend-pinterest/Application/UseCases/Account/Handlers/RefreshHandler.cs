using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class RefreshHandler(IJwtTokenService tokenService) : IRequestHandler<RefreshCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var result = await tokenService.RefreshTokenAsync(request.RefreshToken);

        if (result == null || string.IsNullOrWhiteSpace(result.AccessToken))
        {
            throw new UnauthorizedException(ValidationMessages.InvalidRefreshToken);
        }

        return result;
    }
}
