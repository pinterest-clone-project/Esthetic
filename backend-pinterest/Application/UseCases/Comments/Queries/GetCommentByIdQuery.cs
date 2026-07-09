using Application.Models.DTO.Comment;
using MediatR;

namespace Application.UseCases.Comments.Queries;

public record GetCommentByIdQuery : IRequest<CommentDTO?>
{
    public Guid CommentId { get; init; }
}
