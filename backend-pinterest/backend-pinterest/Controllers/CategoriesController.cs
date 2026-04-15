using Application.UseCases.Categories.Commands;
using Application.UseCases.Categories.Queries;
using MediatR;
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
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand command)
    {
        var category = await mediator.Send(command);
        return Ok(category);
    }
}
