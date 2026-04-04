using FluentValidation;

namespace Application.Common.Validators;

public static class SharedValidationRules
{
    public static IRuleBuilderOptions<T, string> EmailRules<T>(
        this IRuleBuilder<T, string> rule) =>
        rule
            .NotEmpty()
            .WithMessage("Email є обов'язковим")
            .EmailAddress()
            .WithMessage("Невірний формат Email")
            .MaximumLength(255)
            .WithMessage("Email не може бути довшим за 255 символів");

    public static IRuleBuilderOptions<T, string> PasswordRules<T>(
        this IRuleBuilder<T, string> rule) =>
        rule
            .NotEmpty()
            .WithMessage("Пароль є обов'язковим")
            .MinimumLength(6)
            .WithMessage("Пароль повинен містити мінімум 6 символів")
            .MaximumLength(100)
            .WithMessage("Пароль не може бути довшим за 100 символів");

    public static IRuleBuilderOptions<T, string?> PhoneRules<T>(
        this IRuleBuilder<T, string?> rule) =>
        rule
            .Matches(@"^\+?[0-9\s\-\(\)]{7,20}$")
            .WithMessage("Невірний формат номера телефону")
            .MaximumLength(20)
            .WithMessage("Номер телефону не може бути довшим за 20 символів")
            .When(x => x is string s && !string.IsNullOrEmpty(s));

    public static IRuleBuilderOptions<T, string> NameRules<T>(
        this IRuleBuilder<T, string> rule, string fieldName) =>
        rule
            .NotEmpty()
            .WithMessage($"{fieldName} є обов'язковим")
            .MaximumLength(50)
            .WithMessage($"{fieldName} не може бути довшим за 50 символів");

    public static IRuleBuilderOptions<T, string?> BioRules<T>(
        this IRuleBuilder<T, string?> rule) =>
        rule
            .MaximumLength(500)
            .WithMessage("Біографія не може бути довшою за 500 символів");
}
