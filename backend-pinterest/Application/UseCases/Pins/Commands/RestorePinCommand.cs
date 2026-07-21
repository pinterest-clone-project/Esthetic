using MediatR;

namespace Application.UseCases.Pins.Commands;

public record RestorePinCommand(Guid Id, Guid UserId, bool IsAdmin = false) : IRequest<Unit>;
