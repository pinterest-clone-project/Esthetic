using Application.Common.Exceptions;
using Application.Common.Validators;
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
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReports()
    {
        var userId = User.FindFirstValue(JwtClaims.Id)
            ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized);

        var query = new GetMyReportsQuery { ReporterId = Guid.Parse(userId) };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllReports()
    {
        var result = await mediator.Send(new GetAllReportsQuery());
        return Ok(result);
    }
}
