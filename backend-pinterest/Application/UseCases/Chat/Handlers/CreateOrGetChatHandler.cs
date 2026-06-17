using Application.Common.Exceptions;
using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Commands;
using Domain.Entities.Chat;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class CreateOrGetChatHandler(
    IChatRepository chatRepository, IMessageRepository messageRepository, ChatMapper chatMapper, UserMapper userMapper, MessageMapper messageMapper)
    : IRequestHandler<CreateOrGetChatCommand, ChatDTO>
{
    public async Task<ChatDTO> Handle(CreateOrGetChatCommand request, CancellationToken ct)
    {
        if (request.CurrentUserId == request.OtherUserId)
            throw new BadRequestException("Не можна створити чат із самим собою");

        var chat = await chatRepository.GetByUsersAsync(request.CurrentUserId, request.OtherUserId, ct);
        if (chat is null)
        {
            chat = await chatRepository.AddAsync(new ChatEntity
            {
                User1Id = request.CurrentUserId,
                User2Id = request.OtherUserId
            }, ct);
            chat = await chatRepository.GetByUsersAsync(request.CurrentUserId, request.OtherUserId, ct);
        }

        var unread = await messageRepository.GetUnreadCountAsync(chat!.Id, request.CurrentUserId, ct);
        return chatMapper.ToDTO(chat, request.CurrentUserId, unread, messageMapper, userMapper);
    }
}
