using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Follows.Commands;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FollowController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpPut("{followedId}")]
    public async Task<IActionResult> Follow([FromRoute] Guid followedId)
    {
        var result = await mediator.Send(new FollowCommand
        {
            Id = CurrentUserId,
            FollowedId = followedId
        });
        return Ok(result);
    }

    [HttpDelete("{followedId}")]
    public async Task<IActionResult> Unfollow([FromRoute] Guid followedId)
    {
        var result = await mediator.Send(new UnfollowCommand
        {
            Id = CurrentUserId,
            FollowedId = followedId
        });
        return Ok(result);
    }
}
