using MediatR;

namespace Application.UseCases.Account.Commands;

public record ResetPasswordCommand(string Email, string Code, string NewPassword) : IRequest<Unit>;