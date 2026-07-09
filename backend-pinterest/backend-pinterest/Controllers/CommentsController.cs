using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Comments.Commands;
using Application.UseCases.Comments.Queries;
using backend_pinterest.Hubs;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController(IMediator mediator, IHubContext<CommentHub> commentHub) : ControllerBase
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
        var comment = await mediator.Send(commandWithUser);
        
        await commentHub.Clients.Group($"pin_{command.PinId}").SendAsync("CommentCreated", comment);
        
        return Ok(comment);
    }

    [Authorize]
    [HttpPut("update")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateComment([FromForm] UpdateCommentCommand command)
    {
        var commandWithUser = command with { UserId = CurrentUserId };
        var comment = await mediator.Send(commandWithUser);
        
        await commentHub.Clients.Group($"pin_{comment.PinId}").SendAsync("CommentUpdated", comment);
        
        return Ok(comment);
    }

    [Authorize]
    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteComment([FromRoute] Guid commentId)
    {
        var comment = await mediator.Send(new GetCommentByIdQuery { CommentId = commentId });
        if (comment == null)
        {
            throw new NotFoundException("Коментар не знайдено");
        }

        var command = new DeleteCommentCommand
        {
            UserId = CurrentUserId,
            CommentId = commentId
        };

        var result = await mediator.Send(command);
        
        await commentHub.Clients.Group($"pin_{comment.PinId}").SendAsync("CommentDeleted", commentId);
        
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
