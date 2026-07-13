using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Follows.Commands;
using Application.UseCases.Follows.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPut("follow/{followedId}")]
    public async Task<IActionResult> Follow([FromRoute] Guid followedId)
    {
        var result = await mediator.Send(new FollowCommand
        {
            Id = CurrentUserId,
            FollowedId = followedId
        });
        return Ok(result);
    }

    [HttpDelete("unfollow/{followedId}")]
    public async Task<IActionResult> Unfollow([FromRoute] Guid followedId)
    {
        var result = await mediator.Send(new UnfollowCommand
        {
            Id = CurrentUserId,
            FollowedId = followedId
        });
        return Ok(result);
    }

    [Authorize]
    [HttpPost("request/{targetId}")]
    public async Task<IActionResult> SendRequest([FromRoute] Guid targetId)
    {
        var result = await mediator.Send(new SendFollowRequestCommand
        {
            Id = CurrentUserId,
            TargetId = targetId
        });
        return Ok(result);
    }

    [Authorize]
    [HttpPut("accept/{requesterId}")]
    public async Task<IActionResult> AcceptRequest([FromRoute] Guid requesterId)
    {
        var result = await mediator.Send(new AcceptFollowRequestCommand
        {
            Id = CurrentUserId,
            RequesterId = requesterId
        });
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("decline/{requesterId}")]
    public async Task<IActionResult> DeclineRequest([FromRoute] Guid requesterId)
    {
        var result = await mediator.Send(new DeclineFollowRequestCommand
        {
            Id = CurrentUserId,
            RequesterId = requesterId
        });
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("cancel/{targetId}")]
    public async Task<IActionResult> CancelRequest([FromRoute] Guid targetId)
    {
        var result = await mediator.Send(new CancelFollowRequestCommand
        {
            Id = CurrentUserId,
            TargetId = targetId
        });
        return Ok(result);
    }

    [Authorize]
    [HttpGet("requests")]
    public async Task<IActionResult> GetFollowRequests()
    {
        var result = await mediator.Send(new GetFollowRequestsQuery(CurrentUserId));
        return Ok(result);
    }
}
