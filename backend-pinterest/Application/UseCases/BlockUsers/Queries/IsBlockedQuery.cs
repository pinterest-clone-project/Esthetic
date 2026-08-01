using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.BlockUsers.Queries;
public record IsBlockedQuery : IRequest<bool>
{
    [BindNever]
    public Guid BlockerId { get; init; }
    public Guid BlockedId { get; init; }
}
