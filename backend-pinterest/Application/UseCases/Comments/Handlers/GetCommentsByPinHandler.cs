using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.Models.DTO.Comment;
using Application.UseCases.Comments.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class GetCommentsByPinHandler(
    ICommentRepository repository,
    ICommentReactionRepository reactionRepository,
    CommentMapper commentMapper) : IRequestHandler<GetCommentsByPinQuery, List<CommentResponseDTO>>
{
    public async Task<List<CommentResponseDTO>> Handle(GetCommentsByPinQuery request, CancellationToken cancellationToken)
    {
        var comments = await repository.GetByPinIdAsync(request.PinId, cancellationToken);

        // collect all comment ids (including replies)
        var allIds = comments
            .SelectMany(c => c.Replies.Select(r => r.Id).Append(c.Id))
            .ToList();

        var allReactions = await reactionRepository.GetByCommentIdsAsync(allIds, cancellationToken);
        var reactionsByComment = allReactions.GroupBy(r => r.CommentId).ToDictionary(g => g.Key, g => g.ToList());

        var result = new List<CommentResponseDTO>();
        foreach (var comment in comments)
        {
            var dto = commentMapper.ToResponseDto(comment);
            ApplyReactions(dto, reactionsByComment, request.CurrentUserId);

            dto.Replies = comment.Replies
                .Where(r => !r.IsDeleted)
                .OrderBy(r => r.CreatedAt)
                .Select(r =>
                {
                    var replyDto = commentMapper.ToResponseDto(r);
                    ApplyReactions(replyDto, reactionsByComment, request.CurrentUserId);
                    return replyDto;
                })
                .ToList();

            result.Add(dto);
        }

        return result;
    }

    private static void ApplyReactions(
        CommentResponseDTO dto,
        Dictionary<Guid, List<Domain.Entities.Comment.CommentReactionEntity>> reactionsByComment,
        Guid? currentUserId)
    {
        if (!reactionsByComment.TryGetValue(dto.Id, out var reactions)) return;

        dto.Reactions = reactions
            .GroupBy(r => r.Emoji)
            .Select(g => new ReactionGroupDTO(g.Key, g.Count()))
            .ToList();

        dto.MyReaction = currentUserId.HasValue
            ? reactions.FirstOrDefault(r => r.UserId == currentUserId.Value)?.Emoji
            : null;
    }
}
