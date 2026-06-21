using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Pins.Commands;

public record UpdatePinCommand : IRequest<Unit>
{
    public required Guid Id { get; init; }
    public string? MediaUrl { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? SourceUrl { get; init; }
    public Guid? CategoryId { get; init; }
    public List<Guid>? TagIds { get; init; }
}
