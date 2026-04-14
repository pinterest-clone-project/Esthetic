
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Tags.Commands;

public record UpdateTagCommand : IRequest<Unit>
{
    [BindNever]
    public Guid Id { get; init; }
    public string? Name { get; init; }
}
