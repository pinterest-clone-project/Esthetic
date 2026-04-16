using Application.UseCases.Categories.Commands;
using FluentValidation;

namespace Application.UseCases.Categories.Validators;

public class CreateValidator : AbstractValidator<CreateCategoryCommand>
{
}
