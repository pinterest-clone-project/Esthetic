using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Account.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
    [HttpPut("edit")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Edit([FromForm] EditCommand command)
    {
        var request = this.Request;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var commadWithId = command with { Id = Guid.Parse(userId) };
        var result = await mediator.Send(commadWithId);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("follow")]
    public async Task<IActionResult> Follow([FromForm] FollowCommand command)
    {
        var request = this.Request;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var commadWithId = command with { Id = Guid.Parse(userId) };
        var result = await mediator.Send(commadWithId);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
