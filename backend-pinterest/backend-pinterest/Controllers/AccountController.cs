using Application.UseCases.Account.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(IMediator mediator) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost]
    [Route("register")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
