using Application.Models.DTO.Chat;
using MediatR;

namespace Application.UseCases.Chat.Queries;

public record GetUserChatsQuery(Guid UserId) : IRequest<List<ChatDTO>>;