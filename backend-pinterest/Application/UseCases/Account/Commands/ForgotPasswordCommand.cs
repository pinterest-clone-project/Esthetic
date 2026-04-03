using MediatR;

namespace Application.UseCases.Account.Commands;

public record ForgotPasswordCommand(string Email) : IRequest<Unit>;
