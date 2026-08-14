using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Comments.Commands;

public record ToggleCommentReactionCommand : IRequest<IEnumerable<ReactionGroupDTO>>
{
    public Guid CommentId { get; init; }
    public Guid UserId { get; init; }
    public string Emoji { get; init; } = string.Empty;
}
