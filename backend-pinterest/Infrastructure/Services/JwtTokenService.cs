using Application.Interfaces;
using Application.Models.UserDTO;
using Domain.Constants;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Infrastructure.Services;

public class JwtTokenService(
    IConfiguration configuration,
    UserManager<UserEntity> userManager,
    AppDbContext context) : IJwtTokenService
{
    public async Task<TokenDTO> CreateTokenAsync(UserEntity user)
    {
        var key = configuration["Jwt:Key"];

        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim("email", $"{user.Email}"),
            new Claim("firstName", $"{user.FirstName}"),
            new Claim("lastName", $"{user.LastName}"),
            new Claim("image", $"{user.Image}"),
            new Claim("username", $"{user.UserName}")
        };

        foreach (var role in await userManager.GetRolesAsync(user))
        {
            claims.Add(new Claim("role", role));
        }

        var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);
        var signingKey = new SymmetricSecurityKey(keyBytes);

        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            claims: claims,
            expires: AppTimeToLive.AccessTokenTime,
            signingCredentials: signingCredentials
        );

        string accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

        var refreshTokenBytes = new byte[64];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(refreshTokenBytes);
        }

        string refreshToken = Convert.ToBase64String(refreshTokenBytes);

        var tokenEntity = new RefreshTokenEntity
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = AppTimeToLive.RefreshTokenTime,
            CreatedAt = DateTime.UtcNow
        };

        await context.RefreshTokens.AddAsync(tokenEntity);
        await context.SaveChangesAsync();

        return new TokenDTO
        {
            AccessToken = accessTokenString,
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

        var claims = new List<Claim>
        {
            new Claim("email", user.Email ?? ""),
            new Claim("firstName", $"{user.FirstName}"),
            new Claim("lastName", $"{user.LastName}"),
            new Claim("image", user.Image != null? user.Image : "")
        };

        foreach (var role in await userManager.GetRolesAsync(user))
        {
            claims.Add(new Claim("role", role));
        }

        var key = configuration["JWT:Key"]!;
        var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);
        var signingKey = new SymmetricSecurityKey(keyBytes);
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            claims: claims,
            expires: AppTimeToLive.AccessTokenTime,
            signingCredentials: signingCredentials
        );

        string accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

        return new TokenDTO { AccessToken = accessTokenString, RefreshToken = refreshToken };
    }
}