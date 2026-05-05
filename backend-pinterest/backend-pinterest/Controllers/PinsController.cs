using Application.UseCases.Pins.Commands;
using Application.UseCases.Pins.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PinsController(IMediator mediator) : ControllerBase
{
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var pins = await mediator.Send(new GetAllPinsQuery());
        return Ok(pins);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var pin = await mediator.Send(new GetPinByIdQuery(id));
        if (pin == null) return NotFound();
        return Ok(pin);
    }

	[HttpPost("create")]
	public async Task<IActionResult> Create([FromForm] CreatePinCommand command)
	{
	    var pin = await mediator.Send(command);
	    return Ok(pin);
	}

    [HttpPut("update/{id}")]
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
}
