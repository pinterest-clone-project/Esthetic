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
    [Authorize]
    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateComment([FromForm] CreateCommentCommand command)
    {
        var comment = await mediator.Send(command);
        return Ok(comment);
    }

    [Authorize]
    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteComment([FromRoute] Guid commentId)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var command = new DeleteCommentCommand
        {
            UserId = Guid.Parse(userId),
            CommentId = commentId
        };

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("getComments/{pinId}")]
    public async Task<IActionResult> GetComments([FromRoute] Guid pinId)
    {
        var query = new GetCommentsByPinQuery { PinId = pinId };
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
