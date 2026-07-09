using Application.UseCases.Dashboard.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetStatistics()
    {
        var statistics = await mediator.Send(new GetStatisticsQuery());
        return Ok(statistics);
    }

    [HttpGet("daily")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetDailyStatistics()
    {
        var statistics = await mediator.Send(new GetDailyStatisticsQuery());
        return Ok(statistics);
    }
}
