namespace Domain.Constants;

public static class FieldLengths
{
    public const int NameMax = 50;
    // User fields
    public const int BioMax = 500;
    public const int EmailMax = 255;
    public const int PasswordMin = 6;
    public const int PasswordMax = 100;
    public const int PhoneMax = 20;
    public const int BlockReasonMax = 250;

    // Category fields
    public const int SlugMax = 100;
    public const int CategoryDescriptionMax = 1000;

    // Pin fields
    public const int DescriptionMax = 500;

    // Board fields
    public const int BoardTitleMax = 100;
    public const int BoardDescriptionMax = 500;
}
