using Application.UseCases.Chat.Commands;
using FluentValidation;

namespace Application.UseCases.Chat.Validators;

public class SendMessageValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Повідомлення не може бути порожнім")
            .MaximumLength(2000).WithMessage("Повідомлення занадто довге");
    }
}