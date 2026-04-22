using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Comments.Commands;

public record DeleteCommentCommand : IRequest<Unit>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid CommentId { get; init; }
}