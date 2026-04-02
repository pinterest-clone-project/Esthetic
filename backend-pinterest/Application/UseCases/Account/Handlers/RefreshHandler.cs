using Application.Exceptions;
using Application.Interfaces;
using Application.Models.DTO.User;
using Application.UseCases.Account.Commands;
using FluentValidation.Results;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class RefreshHandler(IJwtTokenService tokenService) : IRequestHandler<RefreshCommand, TokenDTO>
{
    public async Task<TokenDTO> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var result = await tokenService.RefreshTokenAsync(request.RefreshToken);

        if (result == null || string.IsNullOrWhiteSpace(result.AccessToken))
        {
            var failures = new List<ValidationFailure> { new ValidationFailure("RefreshToken", "Invalid refresh token.") };

            throw new ValidationException(failures);
        }

        return result;
    }
}
