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
    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateBoardCommand command)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var commandWithOwner = command with { OwnerId = Guid.Parse(userId) };
        var result = await mediator.Send(commandWithOwner);
        return Ok(result);
    }

    [HttpGet("getById/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await mediator.Send(new GetBoardByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBoards([FromQuery] GetUserBoardsQuery query)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var queryWithOwner = query with { OwnerId = Guid.Parse(userId) };
        var result = await mediator.Send(queryWithOwner);
        return Ok(result);
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        await mediator.Send(new DeleteBoardCommand
        {
            Id = id,
            OwnerId = Guid.Parse(userId)
        });

        return NoContent();
    }

    [HttpPut("update/{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateBoardCommand command)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var commandWithIds = command with
        {
            Id = id,
            OwnerId = Guid.Parse(userId)
        };

        var result = await mediator.Send(commandWithIds);
        return Ok(result);
    }
}

