using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Commands;
using Domain.Entities.Chat;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class SendMessageHandler(
    IMessageRepository messageRepository, IChatRepository chatRepository, MessageMapper messageMapper, IChatNotifier chatNotifier)
    : IRequestHandler<SendMessageCommand, MessageDTO>
{
    public async Task<MessageDTO> Handle(SendMessageCommand request, CancellationToken ct)
    {
        var chat = await chatRepository.GetByIdAsync(request.ChatId, ct)
            ?? throw new NotFoundException("Чат не знайдено");

        if (chat.User1Id != request.SenderId && chat.User2Id != request.SenderId)
            throw new ForbiddenException("Ви не є учасником цього чату");

        var message = await messageRepository.AddAsync(new MessageEntity
        {
            ChatId = request.ChatId,
            SenderId = request.SenderId,
            Content = request.Content.Trim()
        }, ct);

        var dto = messageMapper.ToDTO(message);
        var receiverId = chat.User1Id == request.SenderId ? chat.User2Id : chat.User1Id;
        await chatNotifier.NotifyNewMessageAsync(receiverId, dto);

        return dto;
    }
}
