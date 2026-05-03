using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Likes.Commands;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LikesController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [Authorize]
    [HttpPut("like/{pinId}")]
    public async Task<IActionResult> Like([FromRoute] Guid pinId)
    {
        var command = new LikeCommand
        {
            UserId = CurrentUserId,
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("unlike/{pinId}")]
    public async Task<IActionResult> Unlike([FromRoute] Guid pinId)
    {
        var command = new UnlikeCommand
        {
            UserId = CurrentUserId,
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);
    }
}