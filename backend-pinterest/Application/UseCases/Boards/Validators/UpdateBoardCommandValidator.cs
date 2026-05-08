using Application.UseCases.Boards.Commands;
using Domain.Constants;
using FluentValidation;

namespace Application.UseCases.Boards.Validators;

public class UpdateBoardCommandValidator : AbstractValidator<UpdateBoardCommand>
{
    public UpdateBoardCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title cannot be empty")
            .MaximumLength(FieldLengths.BoardTitleMax).WithMessage("Title must be at most 100 characters")
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be at most 500 characters")
            .When(x => x.Description != null);
    }
}