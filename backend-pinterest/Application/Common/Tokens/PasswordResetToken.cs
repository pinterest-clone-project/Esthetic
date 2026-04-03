using System.Globalization;

namespace Application.Common.Tokens;

public record PasswordResetToken(string Code, DateTime ExpiresAtUtc)
{
    public bool IsExpired => ExpiresAtUtc < DateTime.UtcNow;
    public bool IsValid(string code) =>
        string.Equals(Code, code, StringComparison.Ordinal);

    public static PasswordResetToken? Parse(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return null;

        var parts = raw.Split(':', 2);
        if (parts.Length != 2)
            return null;

        if (!DateTime.TryParse(parts[1], CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime expiresAt))
            return null;

        return new PasswordResetToken(parts[0], expiresAt);
    }
}
