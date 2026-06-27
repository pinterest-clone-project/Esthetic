using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Recommended.Command;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RecommendedController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [Authorize]
    [HttpPost("track-view/{pinId}")]
    public async Task<IActionResult> TrackView([FromRoute] Guid pinId)
    {
        var command = new TrackPinViewCommand
        {
            UserId = CurrentUserId,
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);

    }
}
