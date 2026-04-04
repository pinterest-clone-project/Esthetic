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
}
