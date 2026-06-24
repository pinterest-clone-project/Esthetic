using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Pins.Commands;
using Application.UseCases.Pins.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PinsController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));


    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var pins = await mediator.Send(new GetAllPinsQuery(CurrentUserId));
        return Ok(pins);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var pin = await mediator.Send(new GetPinByIdQuery(id, CurrentUserId));
        if (pin == null) return NotFound();
        return Ok(pin);
    }

	[HttpPost("create")]
	[Consumes("multipart/form-data")]
	public async Task<IActionResult> Create([FromForm] CreatePinCommand command)
	{
        var commandWithCreator = command with { CreatorId = CurrentUserId };
        var pin = await mediator.Send(commandWithCreator);
	    return Ok(pin);
	}

    [HttpPut("update/{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] UpdatePinCommand request)
    {
        var command = request with { Id = id };
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeletePinCommand(id));
        return NoContent();
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyPins()
    {
        var pins = await mediator.Send(new GetUserPinsQuery(CurrentUserId));
        return Ok(pins);
    }

    [HttpPost("{pinId:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Save(Guid pinId, [FromBody] SavePinCommand command)
    {
        var cmd = command with { PinId = pinId, UserId = CurrentUserId };
        await mediator.Send(cmd);
        return NoContent();
    }

    [HttpDelete("{pinId:guid}/unsave")]
    [Authorize]
    public async Task<IActionResult> Unsave(Guid pinId, [FromBody] UnsavePinCommand command)
    {
        var cmd = command with { PinId = pinId, UserId = CurrentUserId };
        await mediator.Send(cmd);
        return NoContent();
    }
}
