using Application.Common.Exceptions;
using Application.UseCases.Pins.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;
public class DeletePinHandler(IPinRepository repository)
    : IRequestHandler<DeletePinCommand, Unit>
{
    public async Task<Unit> Handle(DeletePinCommand request, CancellationToken cancellationToken)
    {
        var pin = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Pin not found");
        if (!request.IsAdmin && pin.CreatorId != request.UserId)
            throw new ForbiddenException("You cannot delete this pin");
        pin.IsDeleted = true;
        pin.DeletedAt = DateTime.UtcNow;
        pin.DeletedByAdmin = request.IsAdmin;
        await repository.UpdateAsync(pin, cancellationToken);
        return Unit.Value;
    }
}
