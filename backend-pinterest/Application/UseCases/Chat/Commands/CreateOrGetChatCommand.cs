using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Chat.Commands;

public record CreateOrGetChatCommand(Guid CurrentUserId, Guid OtherUserId) : IRequest<ChatDTO>;
