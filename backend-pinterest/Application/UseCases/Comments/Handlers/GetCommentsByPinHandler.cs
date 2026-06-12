using Application.Mappers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class GetCommentsByPinHandler(
    ICommentRepository repository,
    CommentMapper commentMapper) : IRequestHandler<GetCommentsByPinQuery, List<CommentDTO>>
{
    public async Task<List<CommentDTO>> Handle(GetCommentsByPinQuery request, CancellationToken cancellationToken)
    {
        var comments = await repository.GetByPinIdAsync(request.PinId, cancellationToken);
        return comments.Select(commentMapper.ToDto).ToList();
    }
}