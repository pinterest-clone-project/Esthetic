using Application.Models.DTO.Comment;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Comments.Commands;

public record UpdateCommentCommand : IRequest<CommentDTO>
{
    [BindNever]
    public Guid UserId { get; init; }
    public Guid CommentId { get; init; }
    public required string Text { get; init; }
}
