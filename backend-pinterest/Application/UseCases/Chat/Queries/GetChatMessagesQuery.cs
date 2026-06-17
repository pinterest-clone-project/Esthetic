using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Chat.Queries;

public record GetChatMessagesQuery(Guid ChatId, Guid UserId) : IRequest<List<MessageDTO>>;
