using Application.UseCases.Chat.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Chat.Handlers;

public class MarkChatAsReadCommandHandler(IMessageRepository messageRepository)
    : IRequestHandler<MarkChatAsReadCommand>
{
    public async Task Handle(MarkChatAsReadCommand request, CancellationToken ct)
    {
        await messageRepository.MarkAsReadAsync(request.ChatId, request.UserId, ct);
    }
}