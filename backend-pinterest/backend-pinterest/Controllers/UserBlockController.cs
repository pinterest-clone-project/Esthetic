using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.BlockUsers.Commands;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserBlockController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpPut("{blockedId}")]
    public async Task<IActionResult> Block([FromRoute] Guid blockedId)
    {
        var result = await mediator.Send(new BlockUserCommand
        {
            BlockerId = CurrentUserId,
            BlockedId = blockedId
        });
        return Ok(result);
    }

    [HttpDelete("{blockedId}")]
    public async Task<IActionResult> Unblock([FromRoute] Guid blockedId)
    {
        var result = await mediator.Send(new UnblockUserCommand
        {
            BlockerId = CurrentUserId,
            BlockedId = blockedId
        });
        return Ok(result);
    }
}