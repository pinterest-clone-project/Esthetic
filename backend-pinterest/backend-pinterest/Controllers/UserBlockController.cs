using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.UserBlock.Commands;
using Application.UseCases.UserBlock.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserBlockController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpPut("block/{blockedId}")]
    public async Task<IActionResult> Block([FromRoute] Guid blockedId)
    {
        var result = await mediator.Send(new BlockUserCommand
        {
            BlockerId = CurrentUserId,
            BlockedId = blockedId
        });
        return Ok(result);
    }

    [HttpDelete("unblock/{blockedId}")]
    public async Task<IActionResult> Unblock([FromRoute] Guid blockedId)
    {
        var result = await mediator.Send(new UnblockUserCommand
        {
            BlockerId = CurrentUserId,
            BlockedId = blockedId
        });
        return Ok(result);
    }

    [HttpGet("isBlocked/{blockedId}")]
    public async Task<IActionResult> IsBlocked([FromRoute] Guid blockedId)
    {
        var result = await mediator.Send(new IsBlockedQuery
        {
            BlockerId = CurrentUserId,
            BlockedId = blockedId
        });
        return Ok(result);
    }

    [HttpGet("blocked")]
    public async Task<IActionResult> GetBlockedUsers()
    {
        var result = await mediator.Send(new GetBlockedUsersQuery(CurrentUserId));
        return Ok(result);
    }
}
