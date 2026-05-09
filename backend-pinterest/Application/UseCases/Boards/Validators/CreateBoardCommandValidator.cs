using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Boards.Validators;

public class CreateBoardCommandValidator : AbstractValidator<CreateBoardCommand>
{
    public CreateBoardCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.Required(ValidationMessages.BoardTitleField))
            .MaximumLength(FieldLengths.BoardTitleMax).WithMessage(ValidationMessages.MaxLength(ValidationMessages.BoardTitleField, FieldLengths.BoardTitleMax));

        RuleFor(x => x.Description)
            .MaximumLength(FieldLengths.BoardDescriptionMax).WithMessage(ValidationMessages.MaxLength(ValidationMessages.BoardDescriptionField, FieldLengths.BoardDescriptionMax));
    }
}