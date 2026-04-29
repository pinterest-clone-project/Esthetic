using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Follows.Commands;

public record FollowCommand : IRequest<Unit>
{
    [BindNever]
    public Guid Id { get; init; }
    public Guid FollowedId { get; init; }
}