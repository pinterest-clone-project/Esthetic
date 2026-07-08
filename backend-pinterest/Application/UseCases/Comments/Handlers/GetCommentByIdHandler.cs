using Application.Mappers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class GetCommentByIdHandler(
    ICommentRepository commentRepository,
    CommentMapper mapper) : IRequestHandler<GetCommentByIdQuery, CommentDTO?>
{
    public async Task<CommentDTO?> Handle(GetCommentByIdQuery request, CancellationToken cancellationToken)
    {
        var comment = await commentRepository.GetByIdAsync(request.CommentId, cancellationToken);
        return comment == null ? null : mapper.ToDto(comment);
    }
}
