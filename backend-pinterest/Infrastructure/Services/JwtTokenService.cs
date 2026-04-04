using Application.Interfaces;
using Application.Models.DTO.User;
using Domain.Constants;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Services;

public class JwtTokenService(
    IConfiguration configuration,
    UserManager<UserEntity> userManager,
    AppDbContext context) : IJwtTokenService
{
    public async Task<TokenDTO> CreateTokenAsync(UserEntity user)
    {
        var roles = await userManager.GetRolesAsync(user);
        var claims = BuildClaims(user, roles);
        var accessToken = GenerateAccessToken(claims);
        var refreshToken = await SaveRefreshTokenAsync(user.Id);

        return new TokenDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<TokenDTO?> RefreshTokenAsync(string refreshToken)
    {
        var tokenEntity = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (tokenEntity == null || tokenEntity.ExpiresAt <= DateTime.UtcNow)
            return null;

        var user = await userManager.FindByIdAsync(tokenEntity.UserId.ToString());
        if (user == null)
            return null;

        context.RefreshTokens.Remove(tokenEntity);

        var roles = await userManager.GetRolesAsync(user);
        var claims = BuildClaims(user, roles);
        var accessToken = GenerateAccessToken(claims);
        var newRefreshToken = await SaveRefreshTokenAsync(user.Id);

        return new TokenDTO
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken
        };
    }
    private static List<Claim> BuildClaims(UserEntity user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(JwtClaims.Id,          user.Id.ToString()),
            new(JwtClaims.Email,       user.Email       ?? ""),
            new(JwtClaims.FirstName,   user.FirstName   ?? ""),
            new(JwtClaims.LastName,    user.LastName    ?? ""),
            new(JwtClaims.Image,       user.Image       ?? ""),
            new(JwtClaims.UserName,    user.UserName    ?? ""),
            new(JwtClaims.PhoneNumber, user.PhoneNumber ?? ""),
            new(JwtClaims.Bio,         user.Bio         ?? ""),
            new(JwtClaims.IsPrivate,   user.IsPrivate.ToString()),
            new(JwtClaims.CreatedAt,   user.CreatedAt.ToString("o")),
            new(JwtClaims.UpdatedAt,   user.UpdatedAt?.ToString("o") ?? ""),
        };

        claims.AddRange(roles.Select(role => new Claim(JwtClaims.Role, role)));

        return claims;
    }

    private string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = configuration["Jwt:Key"]!;
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: AppTimeToLive.AccessTokenTime,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    private async Task<string> SaveRefreshTokenAsync(Guid userId)
    {
        var tokenBytes = RandomNumberGenerator.GetBytes(64);
        var refreshToken = Convert.ToBase64String(tokenBytes);

        var tokenEntity = new RefreshTokenEntity
        {
            Token = refreshToken,
            UserId = userId,
            ExpiresAt = AppTimeToLive.RefreshTokenTime,
            CreatedAt = DateTime.UtcNow
        };

        await context.RefreshTokens.AddAsync(tokenEntity);
        await context.SaveChangesAsync();

        return refreshToken;
    }
}