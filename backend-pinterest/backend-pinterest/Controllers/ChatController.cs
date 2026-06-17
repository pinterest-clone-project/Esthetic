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
}