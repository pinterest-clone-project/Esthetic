using FluentValidation;
using Domain.Constants;

namespace Application.Common.Validators;

public static class SharedValidationRules
{
    public static IRuleBuilderOptions<T, string?> EmailRules<T>(this IRuleBuilder<T, string?> rule, string fieldName) =>
        rule
            .IsRequired(fieldName)
            .EmailAddress()
            .WithMessage(ValidationMessages.EmailFormat)
            .MaximumLength(FieldLengths.EmailMax)
            .WithMessage(ValidationMessages.MaxLength(fieldName, FieldLengths.EmailMax));

    public static IRuleBuilderOptions<T, string?> PasswordRules<T>(this IRuleBuilder<T, string?> rule, string fieldName) =>
        rule
            .IsRequired(fieldName)
            .MinimumLength(FieldLengths.PasswordMin)
            .WithMessage(ValidationMessages.MinLength(fieldName, FieldLengths.PasswordMin))
            .MaximumLength(FieldLengths.PasswordMax)
            .WithMessage(ValidationMessages.MaxLength(fieldName, FieldLengths.PasswordMax));

    public static IRuleBuilderOptions<T, string?> PhoneRules<T>(this IRuleBuilder<T, string?> rule) =>
        rule
            .Matches(@"^\+?[0-9\s\-\(\)]{7,20}$")
            .WithMessage(ValidationMessages.PhoneFormat)
            .MaximumLength(FieldLengths.PhoneMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldPhone, FieldLengths.PhoneMax))
            .When(x => x is string s && !string.IsNullOrEmpty(s));

    public static IRuleBuilderOptions<T, string?> NameRules<T>(this IRuleBuilder<T, string?> rule, string fieldName) =>
        rule
            .IsRequired(fieldName)
            .MaximumLength(FieldLengths.NameMax)
            .WithMessage(ValidationMessages.MaxLength(fieldName, FieldLengths.NameMax))
            .When(x => x is string s && !string.IsNullOrEmpty(s));

    public static IRuleBuilderOptions<T, string?> BioRules<T>(this IRuleBuilder<T, string?> rule) =>
        rule
            .MaximumLength(FieldLengths.BioMax)
            .WithMessage(ValidationMessages.MaxLength(ValidationMessages.FieldBio, FieldLengths.BioMax));

    public static IRuleBuilderOptions<T, string?> IsRequired<T>(this IRuleBuilder<T, string?> rule, string fieldName) =>
        rule
            .NotEmpty()
            .WithMessage(ValidationMessages.Required(fieldName));
    public static IRuleBuilderOptions<T, string?> SlugRules<T>(this IRuleBuilder<T, string?> rule, string fieldName) =>
        rule
            .IsRequired(fieldName)
            .MaximumLength(FieldLengths.SlugMax)
            .WithMessage(ValidationMessages.MaxLength(fieldName, FieldLengths.SlugMax))
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage(ValidationMessages.SlugFormat);
}