using Application.Models.DTO.Comment;
using MediatR;

namespace Application.UseCases.Comments.Queries;

public record GetCommentsByPinQuery : IRequest<List<CommentResponseDTO>>
{
    public Guid PinId { get; init; }
}
