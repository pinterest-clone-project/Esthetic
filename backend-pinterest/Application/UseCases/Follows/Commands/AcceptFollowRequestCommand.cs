using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Follows.Commands;

public record AcceptFollowRequestCommand : IRequest<Unit>
{
    [BindNever]
    public Guid Id { get; init; }
    public Guid RequesterId { get; init; }
}
