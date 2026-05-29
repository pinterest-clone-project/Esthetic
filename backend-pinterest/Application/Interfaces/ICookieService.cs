using Application.Models.DTO.User;

namespace Application.Interfaces;

public interface ICookieService
{
    void SetTokenCookies(TokenDTO tokens);
    void ClearTokenCookies();
    string? GetRefreshToken();
}