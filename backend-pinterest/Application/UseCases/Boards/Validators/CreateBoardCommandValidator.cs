using Application.UseCases.Boards.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Boards.Validators;

public class CreateBoardCommandValidator : AbstractValidator<CreateBoardCommand>
{
    public CreateBoardCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(FieldLengths.BoardTitleMax).WithMessage("Title must be at most 100 characters");

        RuleFor(x => x.Description)
            .MaximumLength(FieldLengths.BoardDescriptionMax).WithMessage("Description must be at most 500 characters");
    }
}