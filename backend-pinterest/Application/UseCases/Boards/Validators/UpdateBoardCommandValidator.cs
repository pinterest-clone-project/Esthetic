using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Boards.Validators;

public class UpdateBoardCommandValidator : AbstractValidator<UpdateBoardCommand>
{
    public UpdateBoardCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.Required(ValidationMessages.BoardTitleField))
            .MaximumLength(FieldLengths.BoardTitleMax).WithMessage(ValidationMessages.MaxLength(ValidationMessages.BoardTitleField, FieldLengths.BoardTitleMax))
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(FieldLengths.BoardDescriptionMax).WithMessage(ValidationMessages.MaxLength(ValidationMessages.BoardDescriptionField, FieldLengths.BoardDescriptionMax))
            .When(x => x.Description != null);
    }
}