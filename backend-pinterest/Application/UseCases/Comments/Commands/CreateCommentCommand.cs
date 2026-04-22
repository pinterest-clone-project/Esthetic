using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Comments.Commands;

public record CreateCommentCommand : IRequest<Unit>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid PinId { get; init; }
    public required string Text { get; init; }
}