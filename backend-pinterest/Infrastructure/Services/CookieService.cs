using Application.Interfaces;
using Application.Models.DTO.User;
using Domain.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class CookieService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration) : ICookieService
{
    private readonly HttpContext context = httpContextAccessor.HttpContext!;
    private readonly bool isProduction =
        configuration["ASPNETCORE_ENVIRONMENT"] != "Development";
    private readonly string refreshTokenPath = "/api/Account/refresh";

    public void SetTokenCookies(TokenDTO tokens)
    {
        var sameSite = isProduction ? SameSiteMode.Strict : SameSiteMode.Lax;
        context.Response.Cookies.Append(AuthTokenConstants.AccessTokenCookie, tokens.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = sameSite,
            Expires = DateTimeOffset.UtcNow.AddMinutes(AppTimeToLive.AccessTokenMinutes)
        });

        context.Response.Cookies.Append(AuthTokenConstants.RefreshTokenCookie, tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = sameSite,
            Expires = DateTimeOffset.UtcNow.AddDays(AppTimeToLive.RefreshTokenDays),
            Path = refreshTokenPath
        });
    }

    public void ClearTokenCookies()
    {
        context.Response.Cookies.Delete(AuthTokenConstants.AccessTokenCookie);
        context.Response.Cookies.Delete(AuthTokenConstants.RefreshTokenCookie, new CookieOptions
        {
            Path = refreshTokenPath
        });
    }

    public string? GetRefreshToken() =>
        context.Request.Cookies[AuthTokenConstants.RefreshTokenCookie];
}
