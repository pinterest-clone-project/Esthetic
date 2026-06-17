using Application.Common.Exceptions;
using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class GetChatMessagesQueryHandler(IChatRepository chatRepository, IMessageRepository messageRepository, MessageMapper messageMapper)
    : IRequestHandler<GetChatMessagesQuery, List<MessageDTO>>
{
    public async Task<List<MessageDTO>> Handle(GetChatMessagesQuery request, CancellationToken ct)
    {
        var chat = await chatRepository.GetByIdAsync(request.ChatId, ct)
            ?? throw new NotFoundException("Чат не знайдено");

        if (chat.User1Id != request.UserId && chat.User2Id != request.UserId)
            throw new ForbiddenException("Ви не є учасником цього чату");

        var messages = await messageRepository.GetChatMessagesAsync(request.ChatId, ct);
        return messages.Select(messageMapper.ToDTO).OrderBy(m => m.SentAt).ToList();
    }
}