using Application.Mappers;
using Application.Models.DTO.Chat;
using Application.UseCases.Chat.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class GetUserChatsHandler(
    IChatRepository chatRepository, IMessageRepository messageRepository, ChatMapper chatMapper, UserMapper userMapper, MessageMapper messageMapper)
    : IRequestHandler<GetUserChatsQuery, List<ChatDTO>>
{
    public async Task<List<ChatDTO>> Handle(GetUserChatsQuery request, CancellationToken ct)
    {
        var chats = await chatRepository.GetUserChatsAsync(request.UserId, ct);
        var result = new List<ChatDTO>();

        foreach (var chat in chats)
        {
            var unread = await messageRepository.GetUnreadCountAsync(chat.Id, request.UserId, ct);
            result.Add(chatMapper.ToDTO(chat, request.UserId, unread, messageMapper, userMapper));
        }

        return result.OrderByDescending(c => c.LastMessage?.SentAt ?? c.CreatedAt).ToList();
    }
}