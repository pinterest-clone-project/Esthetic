namespace Domain.Constants;

public static class AppTimeToLive
{
    public const int AccessTokenMinutes = 15;
    public const int RefreshTokenDays = 7;
    public const int ResetPasswordMinutes = 15;
    public const int ListCacheMinutes = 5;

    public static DateTime AccessTokenTime => DateTime.UtcNow.AddMinutes(AccessTokenMinutes);
    public static DateTime RefreshTokenTime => DateTime.UtcNow.AddDays(RefreshTokenDays);
    public static DateTime ResetPasswordExpiration => DateTime.UtcNow.AddMinutes(ResetPasswordMinutes);

    public static readonly TimeSpan ListCacheExpiration = TimeSpan.FromMinutes(ListCacheMinutes);
}
