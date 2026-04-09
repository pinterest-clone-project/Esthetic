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
    public async Task<IActionResult> Create([FromForm] CreateTagDTO dto)
    {
        var tag = await mediator.Send(new CreateTagCommand(dto));
        return Ok(tag);
    }
}
