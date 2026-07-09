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
        
        var result = new List<CommentResponseDTO>();
        foreach (var comment in comments)
        {
            var dto = commentMapper.ToResponseDto(comment);
            dto.Replies = comment.Replies
                .Where(r => !r.IsDeleted)
                .OrderBy(r => r.CreatedAt)
                .Select(commentMapper.ToResponseDto)
                .ToList();
            result.Add(dto);
        }
        
        return result;
    }
}
