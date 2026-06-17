using MediatR;

namespace Application.UseCases.Chat.Commands;

public record MarkChatAsReadCommand(Guid ChatId, Guid UserId) : IRequest;