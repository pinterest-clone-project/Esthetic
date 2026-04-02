using Application.UseCases.Account.Commands;
using MediatR;

namespace Application.UseCases.Account.Handlers;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    public Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
