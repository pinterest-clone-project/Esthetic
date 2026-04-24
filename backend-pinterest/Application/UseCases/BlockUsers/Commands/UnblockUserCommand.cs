using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.BlockUsers.Commands;

public record UnblockUserCommand : IRequest<Unit>
{
    [BindNever]
    public Guid BlockerId { get; init; }
    public Guid BlockedId { get; init; }
}