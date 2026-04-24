using Application.Models.DTO.Comment;
using MediatR;

namespace Application.UseCases.Comments.Queries;

public record GetCommentsByPinQuery : IRequest<List<CommentDTO>>
{
    public Guid PinId { get; init; }
}