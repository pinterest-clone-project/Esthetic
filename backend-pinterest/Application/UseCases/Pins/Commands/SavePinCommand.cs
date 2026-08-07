using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Pins.Commands;
public record SavePinCommand : IRequest<Unit>
{
    public required Guid PinId { get; init; }
    public required Guid BoardId { get; init; }
    public Guid? SectionId { get; init; }
    [BindNever]
    public Guid UserId { get; init; }
}
