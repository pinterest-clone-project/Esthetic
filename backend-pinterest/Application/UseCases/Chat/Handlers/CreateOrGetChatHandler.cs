using Application.Common.Exceptions;
using Application.Interfaces.Notifiers;
using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Commands;
using Domain.Entities.Chat;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class CreateOrGetChatHandler(
    IChatRepository chatRepository,
    IMessageRepository messageRepository,
    ChatMapper chatMapper,
    UserMapper userMapper,
    MessageMapper messageMapper,
    IChatNotifier chatNotifier)
    : IRequestHandler<CreateOrGetChatCommand, ChatDTO>
{
    public async Task<ChatDTO> Handle(CreateOrGetChatCommand request, CancellationToken ct)
    {
        if (request.CurrentUserId == request.OtherUserId)
            throw new BadRequestException("Не можна створити чат із самим собою");

        var chat = await chatRepository.GetByUsersAsync(request.CurrentUserId, request.OtherUserId, ct);

        var isNewChat = chat is null;

        if (isNewChat)
        {
            chat = await chatRepository.AddAsync(new ChatEntity
            {
                User1Id = request.CurrentUserId,
                User2Id = request.OtherUserId
            }, ct);
            chat = await chatRepository.GetByUsersAsync(request.CurrentUserId, request.OtherUserId, ct);
        }

        var unreadForCurrent = await messageRepository.GetUnreadCountAsync(chat!.Id, request.CurrentUserId, ct);
        var chatDTOForCurrent = chatMapper.ToDTO(chat, request.CurrentUserId, unreadForCurrent, messageMapper, userMapper);

        if (isNewChat)
        {
            var unreadForOther = await messageRepository.GetUnreadCountAsync(chat.Id, request.OtherUserId, ct);
            var chatDTOForOther = chatMapper.ToDTO(chat, request.OtherUserId, unreadForOther, messageMapper, userMapper);
            await chatNotifier.NotifyNewChatAsync(request.OtherUserId, chatDTOForOther);
        }

        return chatDTOForCurrent;
    }
}