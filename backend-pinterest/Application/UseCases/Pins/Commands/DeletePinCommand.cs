using Domain.Constants;
using MediatR;

namespace Application.UseCases.Pins.Commands;

public record DeletePinCommand(Guid Id) : IRequest<Unit>;
