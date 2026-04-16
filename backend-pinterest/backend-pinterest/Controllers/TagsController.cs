using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using Application.UseCases.Tags.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await mediator.Send(new GetAllTagsQuery());
        return Ok(tags);
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateTagCommand command)
    {
        var tag = await mediator.Send(command);
        return Ok(tag);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tag = await mediator.Send(new GetTagByIdQuery(id));
        if (tag == null) return NotFound();
        return Ok(tag);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateTagCommand request)
    {
        var command = request with { Id = id };
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteTagCommand(id));
        return NoContent();
    }
}
