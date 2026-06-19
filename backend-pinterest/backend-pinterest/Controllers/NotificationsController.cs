using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Notifications.Commands;
using Application.UseCases.Notifications.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationsController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await mediator.Send(new GetNotificationsQuery(CurrentUserId)));

    [HttpPost("read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        await mediator.Send(new MarkNotificationsAsReadCommand(CurrentUserId));
        return Ok();
    }

    [HttpPost("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(Guid notificationId)
    {
        await mediator.Send(new MarkNotificationAsReadCommand(notificationId));
        return Ok();
    }
}