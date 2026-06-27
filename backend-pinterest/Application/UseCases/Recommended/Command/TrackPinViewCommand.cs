using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Recommended.Command;

public class TrackPinViewCommand : IRequest<Unit>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid PinId { get; init; }
}
