using Application.UseCases.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await mediator.Send(new GetAllCategoriesQuery());
        return Ok(categories);
    }
}
