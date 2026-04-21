using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Pins.Commands;

public class LikeCommand : IRequest<Unit>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid PinId { get; init; }
}