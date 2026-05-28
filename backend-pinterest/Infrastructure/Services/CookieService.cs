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
    private readonly string refreshTokenPath = "/api/account/refresh";

    public void SetTokenCookies(TokenDTO tokens)
    {
        context.Response.Cookies.Append(AuthTokenConstants.AccessTokenCookie, tokens.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Strict,
            Expires = AppTimeToLive.AccessTokenTime
        });

        context.Response.Cookies.Append(AuthTokenConstants.RefreshTokenCookie, tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Strict,
            Expires = AppTimeToLive.RefreshTokenTime,
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
