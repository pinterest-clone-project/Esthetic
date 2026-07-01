using Application.Mappers;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class GetCommentsByPinHandler(
    ICommentRepository repository,
    CommentMapper commentMapper) : IRequestHandler<GetCommentsByPinQuery, List<CommentResponseDTO>>
{
    public async Task<List<CommentResponseDTO>> Handle(GetCommentsByPinQuery request, CancellationToken cancellationToken)
    {
        var comments = await repository.GetByPinIdAsync(request.PinId, cancellationToken);
        return comments.Select(commentMapper.ToResponseDto).ToList();
    }
}
