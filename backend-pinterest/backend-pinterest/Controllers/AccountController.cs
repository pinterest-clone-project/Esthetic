using Application.UseCases.Account.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("edit/{id:Guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Edit(Guid id, [FromForm] EditCommand command)
    {
        var commandWithId = command with { Id = id };
        var result = await mediator.Send(commandWithId);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
