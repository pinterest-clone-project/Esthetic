using Application.UseCases.Categories.Commands;
using Application.UseCases.Categories.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var categories = await mediator.Send(new GetAllCategoriesQuery());
        return Ok(categories);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var category = await mediator.Send(new GetCategoryByIdQuery(id));
        return Ok(category);
    }

    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateCategoryCommand command)
    {
        var category = await mediator.Send(command);
        return Ok(category);
    }

    [HttpPut("update/{id}")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] UpdateCategoryCommand command)
    {
        var commandWithId = command with { Id = id };
        var category = await mediator.Send(commandWithId);
        return Ok(category);
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteCategoryCommand(id));
        return NoContent();
    }
}
