namespace Domain.Constants;

public static class AppTimeToLive
{
    public static readonly DateTime AccessTokenTime = DateTime.UtcNow.AddMinutes(15);
    public static readonly DateTime RefreshTokenTime = DateTime.UtcNow.AddDays(30);
}
