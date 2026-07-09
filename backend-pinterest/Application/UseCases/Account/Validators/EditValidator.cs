using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using FluentValidation;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Application.UseCases.Account.Validators;

public class EditValidator : AbstractValidator<EditCommand>
{
    public EditValidator()
    {
        RuleFor(x => x.FirstName)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (string.IsNullOrWhiteSpace(optional.Value))
                    ctx.AddFailure(ValidationMessages.Required(ValidationMessages.FieldFirstName));
                else if (optional.Value!.Length > FieldLengths.NameMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldFirstName, FieldLengths.NameMax));
            });

        RuleFor(x => x.LastName)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (string.IsNullOrWhiteSpace(optional.Value))
                    ctx.AddFailure(ValidationMessages.Required(ValidationMessages.FieldLastName));
                else if (optional.Value!.Length > FieldLengths.NameMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldLastName, FieldLengths.NameMax));
            });

        RuleFor(x => x.Email)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (string.IsNullOrWhiteSpace(optional.Value))
                    ctx.AddFailure(ValidationMessages.Required(ValidationMessages.FieldEmail));
                else if (!Regex.IsMatch(optional.Value!, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                    ctx.AddFailure(ValidationMessages.EmailFormat);
                else if (optional.Value!.Length > FieldLengths.EmailMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldEmail, FieldLengths.EmailMax));
            });

        RuleFor(x => x.Bio)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (optional.Value?.Length > FieldLengths.BioMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldBio, FieldLengths.BioMax));
            });

        RuleFor(x => x.PhoneNumber)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (string.IsNullOrEmpty(optional.Value)) return;
                if (!Regex.IsMatch(optional.Value!, @"^\+?[0-9\s\-\(\)]{7,20}$"))
                    ctx.AddFailure(ValidationMessages.PhoneFormat);
                else if (optional.Value!.Length > FieldLengths.PhoneMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldPhone, FieldLengths.PhoneMax));
            });


        RuleFor(x => x.Country)
    .Custom((optional, ctx) =>
    {
        if (!optional.HasValue || optional.IsCleared) return;
        if (string.IsNullOrWhiteSpace(optional.Value))
            ctx.AddFailure(ValidationMessages.Required(ValidationMessages.FieldCountry));
        else if (optional.Value!.Length > FieldLengths.CountryMax)
            ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldCountry, FieldLengths.CountryMax));
    });

        RuleFor(x => x.Language)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (string.IsNullOrWhiteSpace(optional.Value))
                    ctx.AddFailure(ValidationMessages.Required(ValidationMessages.FieldLanguage));
                else if (optional.Value!.Length > FieldLengths.LanguageMax)
                    ctx.AddFailure(ValidationMessages.MaxLength(ValidationMessages.FieldLanguage, FieldLengths.LanguageMax));
            });

        RuleFor(x => x.CategoryIds)
            .Custom((optional, ctx) =>
            {
                if (!optional.HasValue || optional.IsCleared) return;
                if (optional.Value is not { Count: >= 3 })
                    ctx.AddFailure(ValidationMessages.MinItems(ValidationMessages.FieldCategoryIds, 3));
            });
    }
}