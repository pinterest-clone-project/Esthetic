using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Interfaces;
using Application.UseCases.Account.Commands;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(IMediator mediator, ICookieService cookieService) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var tokens = await mediator.Send(command);
        cookieService.SetTokenCookies(tokens);
        return Ok();
    }

    [HttpPost("register")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterCommand command)
    {
        var tokens = await mediator.Send(command);
        cookieService.SetTokenCookies(tokens);
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = cookieService.GetRefreshToken()
            ?? throw new UnauthorizedException(ValidationMessages.InvalidRefreshToken);

        var tokens = await mediator.Send(new RefreshCommand(refreshToken));
        cookieService.SetTokenCookies(tokens);
        return Ok();
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        cookieService.ClearTokenCookies();
        return Ok();
    }

    [Authorize]
    [HttpPatch("edit")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Edit([FromForm] EditCommand command)
    {
        var commandWithId = command with { Id = CurrentUserId };
        var result = await mediator.Send(commandWithId);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }

    [HttpPost("google")]
    public async Task<IActionResult> Google([FromBody] GoogleCommand command)
    {
        var tokens = await mediator.Send(command);
        cookieService.SetTokenCookies(tokens);
        return Ok();
    }
}