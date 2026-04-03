using Application.Models.DTO.User;
using Domain.Entities.Identity;

namespace Application.Interfaces;

public interface IJwtTokenService
{
    Task<TokenDTO> CreateTokenAsync(UserEntity user);
    Task<TokenDTO?> RefreshTokenAsync(string refreshToken);
}