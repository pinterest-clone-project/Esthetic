using Application.UseCases.Pins.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class DeletePinHandler(IPinRepository repository)
    : IRequestHandler<DeletePinCommand, Unit>
{
    public async Task<Unit> Handle(DeletePinCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
