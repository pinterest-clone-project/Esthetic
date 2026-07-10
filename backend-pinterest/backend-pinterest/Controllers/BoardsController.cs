using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Application.UseCases.Boards.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardsController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateBoardCommand command)
    {
        var commandWithOwner = command with { OwnerId = CurrentUserId };
        var result = await mediator.Send(commandWithOwner);
        return Ok(result);
    }

    [HttpGet("getById/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await mediator.Send(new GetBoardByIdQuery(id, CurrentUserId));
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBoards([FromQuery] GetUserBoardsQuery query)
    {
        var queryWithOwner = query with { OwnerId = CurrentUserId };
        var result = await mediator.Send(queryWithOwner);
        return Ok(result);
    }

    [HttpGet("search")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Search([FromQuery] SearchBoardsQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteBoardCommand
        {
            Id = id,
            OwnerId = CurrentUserId
        });

        return NoContent();
    }

    [HttpPut("update/{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateBoardCommand command)
    {
        var commandWithIds = command with
        {
            Id = id,
            OwnerId = CurrentUserId,
            SkipOwnerValidation = User.IsInRole(Roles.Admin)
        };

        var result = await mediator.Send(commandWithIds);
        return Ok(result);
    }
}

