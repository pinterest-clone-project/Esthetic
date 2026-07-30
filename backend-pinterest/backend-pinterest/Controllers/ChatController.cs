using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Chat.Commands;
using Application.UseCases.Chat.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ChatController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpGet]
    public async Task<IActionResult> GetChats()
        => Ok(await mediator.Send(new GetUserChatsQuery(CurrentUserId)));

    [HttpPost("with/{otherUserId}")]
    public async Task<IActionResult> GetOrCreateChat(Guid otherUserId)
        => Ok(await mediator.Send(new CreateOrGetChatCommand(CurrentUserId, otherUserId)));

    [HttpGet("{chatId}/messages")]
    public async Task<IActionResult> GetMessages(Guid chatId)
        => Ok(await mediator.Send(new GetChatMessagesQuery(chatId, CurrentUserId)));

    [HttpPost("{chatId}/messages")]
    public async Task<IActionResult> SendMessage(Guid chatId, [FromBody] SendMessageBody body)
        => Ok(await mediator.Send(new SendMessageCommand(chatId, CurrentUserId, body.Content)));

    [HttpPost("{chatId}/read")]
    public async Task<IActionResult> MarkAsRead(Guid chatId)
    {
        await mediator.Send(new MarkChatAsReadCommand(chatId, CurrentUserId));
        return Ok();
    }

    [HttpPost("messages/{messageId}/reactions")]
    public async Task<IActionResult> ToggleReaction(Guid messageId, [FromBody] ToggleReactionBody body)
        => Ok(await mediator.Send(new ToggleReactionCommand(messageId, CurrentUserId, body.Emoji)));
}

public record SendMessageBody(string Content);
public record ToggleReactionBody(string Emoji);