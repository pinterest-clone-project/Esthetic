using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Pins.Commands;
public record UnsavePinCommand : IRequest<Unit>
{
    public required Guid PinId { get; init; }
    public required Guid BoardId { get; init; }
    [BindNever]
    public Guid UserId { get; init; }
}
