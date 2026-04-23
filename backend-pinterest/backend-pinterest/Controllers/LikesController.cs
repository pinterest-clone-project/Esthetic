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
    [Authorize]
    [HttpPost("like/{pinId}")]
    public async Task<IActionResult> Like([FromRoute] Guid pinId)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var command = new LikeCommand
        {
            UserId = Guid.Parse(userId),
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("like/{pinId}")]
    public async Task<IActionResult> Unlike([FromRoute] Guid pinId)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var command = new UnlikeCommand
        {
            UserId = Guid.Parse(userId),
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);
    }
}