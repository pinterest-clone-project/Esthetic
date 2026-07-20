using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Pins.Handlers;

public class RestorePinHandler(IPinRepository repository)
    : IRequestHandler<RestorePinCommand, Unit>
{
    public async Task<Unit> Handle(RestorePinCommand request, CancellationToken ct)
    {
        if (request.IsAdmin)
        {
            await repository.RestoreAsync(request.Id, ct);
            return Unit.Value;
        }
        var pin = await repository.GetByIdAsync(request.Id, ct);

        if (pin == null)
        {
            var deleted = (await repository.GetDeletedByUserAsync(request.UserId, ct))
                .FirstOrDefault(p => p.Id == request.Id);
            if (deleted == null)
                throw new NotFoundException(ValidationMessages.UserNotFound);
            if (deleted.CreatorId != request.UserId)
                throw new ForbiddenException(ValidationMessages.ErrorForbidden);
            if (deleted.DeletedByAdmin)
                throw new ForbiddenException("This pin can only be restored by an administrator");
        }

        await repository.RestoreAsync(request.Id, ct);
        return Unit.Value;
    }
}
