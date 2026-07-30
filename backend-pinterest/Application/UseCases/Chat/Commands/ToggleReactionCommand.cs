using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Chat.Commands;

public record ToggleReactionCommand(Guid MessageId, Guid UserId, string Emoji)
    : IRequest<IEnumerable<ReactionGroupDTO>>;
