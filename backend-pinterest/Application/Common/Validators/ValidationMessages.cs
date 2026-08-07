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
    public static string FieldBirthDate => Get("FieldBirthDate");
    public static string FieldPassword => Get("FieldPassword");
    public static string FieldNewPassword => Get("FieldNewPassword");
    public static string FieldFirstName => Get("FieldFirstName");
    public static string FieldLastName => Get("FieldLastName");
    public static string FieldUsername => Get("FieldUsername");
    public static string FieldPhone => Get("FieldPhone");
    public static string FieldBio => Get("FieldBio");
    public static string FieldCode => Get("FieldCode");
    public static string FieldRefreshToken => Get("FieldRefreshToken");
    public static string FieldTitle => Get("FieldTitle");
    public static string FieldMediaUrl => Get("FieldMediaUrl");
    public static string FieldSourceUrl => Get("FieldSourceUrl");
    public static string PinImageRequired => Get("PinImageRequired");
    public static string FieldPinId => Get("FieldPinId");

    public static string ErrorValidation => Get("ErrorValidation");
    public static string ErrorBadRequest => Get("ErrorBadRequest");
    public static string ErrorUnauthorized => Get("ErrorUnauthorized");
    public static string ErrorNotFound => Get("ErrorNotFound");
    public static string ErrorDomain => Get("ErrorDomain");
    public static string ErrorInternal => Get("ErrorInternal");
    public static string ErrorForbidden => Get("ErrorForbidden");

    public static string ErrorTokenInvalid => Get("ErrorTokenInvalid");
    public static string ErrorNoPermission => Get("ErrorNoPermission");
    public static string UserNotFound => Get("UserNotFound");
    public static string InvalidRefreshToken => Get("InvalidRefreshToken");
    public static string InvalidConfirmationCode => Get("InvalidConfirmationCode");
    public static string CodeHasExpired => Get("CodeHasExpired");
    public static string FieldName => Get("FieldName");
    public static string FieldSlug => Get("FieldSlug");
    public static string FieldDescription => Get("FieldDescription");
    public static string SlugFormat => Get("SlugFormat");
    public static string FieldId => Get("FieldId");
    public static string InvalidId => Get("InvalidId");
    public static string BoardTitleField => Get("BoardTitleField");
    public static string BoardDescriptionField => Get("BoardDescriptionField");
    public static string Board => Get("Board");
    public static string BoardSection => Get("BoardSection");
    public static string BoardDelOwnBoards => Get("BoardDelOwnBoards");
    public static string BoardSectionDelOwnSections => Get("BoardSectionDelOwnSections");
    public static string BoardUpdateOwnBoards => Get("BoardUpdateOwnBoards");
    public static string BoardUpdateOwnBoardSections => Get("BoardUpdateOwnBoardSections");
    public static string Tag => Get("Tag");
    public static string EmailAlreadyExists => Get("EmailAlreadyExists");
    public static string UserNameAlreadyTaken => Get("UserNameAlreadyTaken");
    public static string UserNameFormat => Get("UserNameFormat");
    public static string GoogleLinkFailed => Get("GoogleLinkFailed");
    public static string ExternalLoginLinkFailed => Get("ExternalLoginLinkFailed");
    public static string UserAlreadyBlocked => Get("UserAlreadyBlocked");
    public static string UserNotBlocked => Get("UserNotBlocked");
    public static string ErrorConflict => Get("ErrorConflict");
    public static string FieldBlockReason => Get("FieldBlockReason");
    public static string FieldCountry => Get("FieldCountry");
    public static string FieldLanguage => Get("FieldLanguage");
    public static string FieldCategoryIds => Get("FieldCategoryIds");
    public static string MinItems(string field, int min)
    => string.Format(Get("MinItems"), field, min);
    public static string MustBePast(string field)
        => string.Format(Get("MustBePast"), field);
    private static string Get(string key)
        => _manager.GetString(key, CultureInfo.CurrentCulture) ?? key;
}
