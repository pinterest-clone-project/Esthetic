using System.Globalization;
using System.Resources;

namespace Application.Common.Validators;

public static class ValidationMessages
{
    private static readonly ResourceManager _manager = new(
        "Application.Common.Resources.ValidationMessages",
        typeof(ValidationMessages).Assembly);

    public static string Required(string field)
        => string.Format(Get("Required"), field);

    public static string MaxLength(string field, int max)
        => string.Format(Get("MaxLength"), field, max);

    public static string MinLength(string field, int min)
        => string.Format(Get("MinLength"), field, min);

    public static string NotFound(string entity)
        => string.Format(Get("NotFound"), entity);

    public static string EmailFormat => Get("EmailFormat");
    public static string PhoneFormat => Get("PhoneFormat");
    public static string InvalidCredentials => Get("InvalidCredentials");

    public static string FieldEmail => Get("FieldEmail");
    public static string FieldPassword => Get("FieldPassword");
    public static string FieldNewPassword => Get("FieldNewPassword");
    public static string FieldFirstName => Get("FieldFirstName");
    public static string FieldLastName => Get("FieldLastName");
    public static string FieldUsername => Get("FieldUsername");
    public static string FieldPhone => Get("FieldPhone");
    public static string FieldBio => Get("FieldBio");
    public static string FieldCode => Get("FieldCode");
    public static string FieldRefreshToken => Get("FieldRefreshToken");

    private static string Get(string key)
        => _manager.GetString(key, CultureInfo.CurrentCulture) ?? key;
}