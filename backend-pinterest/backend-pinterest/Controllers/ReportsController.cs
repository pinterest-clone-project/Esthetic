using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Reports.Commands;
using Application.UseCases.Reports.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReports()
    {
        var query = new GetMyReportsQuery { ReporterId = CurrentUserId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllReports([FromQuery] GetAllReportsQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateReport([FromBody] CreateReportCommand command)
    {
        var commandWithId = command with { ReporterId = CurrentUserId };
        var result = await mediator.Send(commandWithId);
        return Ok(result);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateReportStatusCommand command)
    {
        var commandWithId = command with { Id = id };
        await mediator.Send(commandWithId);
        return NoContent();
    }
}
