namespace Domain.Constants;

public static class Roles
{
    public const string Admin = "Admin";
    public const string User = "User";
    public static string[] AllRoles => new[] { Admin, User };
}