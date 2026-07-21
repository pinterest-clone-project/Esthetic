using Domain.Constants;
using MediatR;

namespace Application.UseCases.Pins.Commands;

public record DeletePinCommand(Guid Id, Guid UserId, bool IsAdmin) : IRequest<Unit>;
