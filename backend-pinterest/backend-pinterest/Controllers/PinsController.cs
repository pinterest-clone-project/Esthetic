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

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchPinsQuery query)
    {
        var currentUserId = Guid.TryParse(User.FindFirstValue(JwtClaims.Id), out var id) ? id : Guid.Empty;
        var result = await mediator.Send(query with { CurrentUserId = currentUserId });
        return Ok(result);
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
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeletePinCommand(id, CurrentUserId, User.IsInRole(Roles.Admin)));
        return NoContent();
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyPins()
    {
        var pins = await mediator.Send(new GetUserPinsQuery(CurrentUserId, CurrentUserId));
        return Ok(pins);
    }

    [HttpGet("saved")]
    [Authorize]
    public async Task<IActionResult> GetSaved()
    {
        var pins = await mediator.Send(new GetSavedPinsQuery(CurrentUserId));
        return Ok(pins);
    }

    [HttpPost("{pinId:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Save([FromRoute] Guid pinId, [FromBody] SavePinCommand command)
    {
        var cmd = command with { PinId = pinId, UserId = CurrentUserId };
        await mediator.Send(cmd);
        return NoContent();
    }

    [HttpDelete("{pinId:guid}/unsave")]
    [Authorize]
    public async Task<IActionResult> Unsave([FromRoute] Guid pinId, [FromBody] UnsavePinCommand command)
    {
        var cmd = command with { PinId = pinId, UserId = CurrentUserId };
        await mediator.Send(cmd);
        return NoContent();
    }

    [HttpGet("{pinId:guid}/saved-boards")]
    [Authorize]
    public async Task<IActionResult> GetSavedBoards(Guid pinId)
    {
        var boardIds = await mediator.Send(new GetPinSavedBoardsQuery(pinId, CurrentUserId));
        return Ok(boardIds);
    }

    [HttpGet("byUser/{userId:guid}")]
    public async Task<IActionResult> GetByUser([FromRoute] Guid userId)
    {
        var currentUserId = Guid.TryParse(User.FindFirstValue(JwtClaims.Id), out var id) ? id : Guid.Empty;
        var pins = await mediator.Send(new GetUserPinsQuery(userId, currentUserId));
        return Ok(pins);
    }

    [HttpGet("deleted")]
    [Authorize]
    public async Task<IActionResult> GetDeleted()
    {
        var pins = await mediator.Send(new GetDeletedPinsQuery(CurrentUserId));
        return Ok(pins);
    }

    [HttpPost("restore/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Restore(Guid id)
    {
        await mediator.Send(new RestorePinCommand(id, CurrentUserId));
        return NoContent();
    }

    [HttpPost("admin/restore/{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> AdminRestore(Guid id)
    {
        await mediator.Send(new RestorePinCommand(id, CurrentUserId, true));
        return NoContent();
    }

    [HttpGet("{pinId:guid}/saved-locations")]
    [Authorize]
    public async Task<IActionResult> GetSavedLocations(Guid pinId)
    {
        var locations = await mediator.Send(
            new GetPinSavedLocationQuery(
                pinId,
                CurrentUserId
            )
        );

        return Ok(locations);
    }

}
