using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Boards.Commands;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BoardsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateBoardCommand command)
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var commandWithOwner = command with { OwnerId = Guid.Parse(userId) };
        var result = await mediator.Send(commandWithOwner);
        return Ok(result);
    }
}

