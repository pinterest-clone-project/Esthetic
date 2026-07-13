using MediatR;

namespace Application.UseCases.Pins.Commands;

public record RestorePinCommand(Guid Id, Guid UserId) : IRequest<Unit>;
