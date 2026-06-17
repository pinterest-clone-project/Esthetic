using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Chat.Commands;

public record SendMessageCommand(Guid ChatId, Guid SenderId, string Content) : IRequest<MessageDTO>;