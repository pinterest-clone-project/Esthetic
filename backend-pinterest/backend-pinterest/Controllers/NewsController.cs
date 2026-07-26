using Application.UseCases.News.Commands;
using Application.UseCases.News.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsController(IMediator mediator) : ControllerBase
{
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var news = await mediator.Send(new GetAllNewsQuery());
        return Ok(news);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var news = await mediator.Send(new GetNewsByIdQuery(id));
        if (news == null)
            return NotFound();
        return Ok(news);
    }

    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromForm] CreateNewsCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("update/{id}")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] UpdateNewsCommand command)
    {
        var commandWithId = command with { Id = id };
        await mediator.Send(commandWithId);
        return Ok();
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteNewsCommand(id));
        return NoContent();
    }
}
