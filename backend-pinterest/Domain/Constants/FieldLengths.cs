namespace Domain.Constants;

public static class FieldLengths
{
    public const int NameMax = 50;
    public const int UserNameMin = 3;
    public const int UserNameMax = 20;
    // User fields
    public const int BioMax = 500;
    public const int EmailMax = 255;
    public const int PasswordMin = 6;
    public const int PasswordMax = 100;
    public const int PhoneMax = 20;
    public const int BlockReasonMax = 250;
    public const int CountryMax = 100;
    public const int LanguageMax = 50;

    // Category fields
    public const int SlugMax = 100;
    public const int CategoryDescriptionMax = 1000;

    // Pin fields
    public const int DescriptionMax = 500;

    // Board fields
    public const int BoardTitleMax = 100;
    public const int BoardDescriptionMax = 500;
}
