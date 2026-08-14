using Application.Common.Exceptions;
using Application.Interfaces.Notifiers;
using Application.Models.DTO.Chat;
using Application.UseCases.Comments.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Comments.Handlers;

public class ToggleCommentReactionHandler(
    ICommentRepository commentRepository,
    ICommentReactionRepository reactionRepository,
    ICommentNotifier commentNotifier)
    : IRequestHandler<ToggleCommentReactionCommand, IEnumerable<ReactionGroupDTO>>
{
    public async Task<IEnumerable<ReactionGroupDTO>> Handle(ToggleCommentReactionCommand request, CancellationToken ct)
    {
        var comment = await commentRepository.GetByIdAsync(request.CommentId, ct)
            ?? throw new NotFoundException("Коментар не знайдено");

        var updatedReactions = await reactionRepository.ToggleAsync(request.CommentId, request.UserId, request.Emoji, ct);

        var grouped = updatedReactions
            .GroupBy(r => r.Emoji)
            .Select(g => new ReactionGroupDTO(g.Key, g.Count()))
            .ToList();

        await commentNotifier.NotifyReactionUpdatedAsync(comment.PinId, request.CommentId, grouped);

        return grouped;
    }
}
