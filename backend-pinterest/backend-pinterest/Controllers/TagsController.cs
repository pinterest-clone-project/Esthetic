using Application.UseCases.Tags.Commands;
using Application.UseCases.Tags.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var tags = await mediator.Send(new GetAllTagsQuery());
        return Ok(tags);
    }
    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateTagCommand command)
    {
        var tag = await mediator.Send(command);
        return Ok(tag);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tag = await mediator.Send(new GetTagByIdQuery(id));
        if (tag == null) return NotFound();
        return Ok(tag);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateTagCommand request)
    {
        var command = request with { Id = id };
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteTagCommand(id));
        return NoContent();
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchTagsQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
