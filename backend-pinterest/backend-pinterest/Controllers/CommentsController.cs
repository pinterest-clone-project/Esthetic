using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Comments.Commands;
using Application.UseCases.Comments.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [Authorize]
    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateComment([FromForm] CreateCommentCommand command)
    {
        var commandWithUser = command with { UserId = CurrentUserId };
        return Ok(await mediator.Send(commandWithUser));
    }

    [Authorize]
    [HttpPut("update")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateComment([FromForm] UpdateCommentCommand command)
    {
        var commandWithUser = command with { UserId = CurrentUserId };
        return Ok(await mediator.Send(commandWithUser));
    }

    [Authorize]
    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteComment([FromRoute] Guid commentId)
    {
        var command = new DeleteCommentCommand
        {
            UserId = CurrentUserId,
            CommentId = commentId
        };

        return Ok(await mediator.Send(command));
    }

    [HttpGet("getComments/{pinId}")]
    public async Task<IActionResult> GetComments([FromRoute] Guid pinId)
    {
        var query = new GetCommentsByPinQuery { PinId = pinId };
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
