using Application.Models.DTO.User;

namespace Application.Interfaces;

public interface ICookieService
{
    void SetTokenCookies(TokenDTO tokens);
    void UpdateAccessTokenCookie(string newAccessToken);
    void ClearTokenCookies();
    string? GetRefreshToken();
}