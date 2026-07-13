using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Follows.Commands;

public record CancelFollowRequestCommand : IRequest<Unit>
{
    [BindNever]
    public Guid Id { get; init; }
    public Guid TargetId { get; init; }
}
