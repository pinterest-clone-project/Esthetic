using Application.Common.Exceptions;
using Application.Interfaces.Notifiers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class ToggleReactionHandler(
    IMessageRepository messageRepository,
    IMessageReactionRepository reactionRepository,
    IChatRepository chatRepository,
    IChatNotifier chatNotifier)
    : IRequestHandler<ToggleReactionCommand, IEnumerable<ReactionGroupDTO>>
{
    public async Task<IEnumerable<ReactionGroupDTO>> Handle(ToggleReactionCommand request, CancellationToken ct)
    {
        var message = await messageRepository.GetByIdAsync(request.MessageId, ct)
            ?? throw new NotFoundException("Повідомлення не знайдено");

        var chat = await chatRepository.GetByIdAsync(message.ChatId, ct)
            ?? throw new NotFoundException("Чат не знайдено");

        if (chat.User1Id != request.UserId && chat.User2Id != request.UserId)
            throw new ForbiddenException("Ви не є учасником цього чату");

        var updatedReactions = await reactionRepository.ToggleAsync(request.MessageId, request.UserId, request.Emoji, ct);

        var grouped = updatedReactions
            .GroupBy(r => r.Emoji)
            .Select(g => new ReactionGroupDTO(g.Key, g.Count()))
            .ToList();

        var otherId = chat.User1Id == request.UserId ? chat.User2Id : chat.User1Id;

        await Task.WhenAll(
            chatNotifier.NotifyReactionUpdatedAsync(request.UserId, request.MessageId, grouped),
            chatNotifier.NotifyReactionUpdatedAsync(otherId, request.MessageId, grouped)
        );

        return grouped;
    }
}
