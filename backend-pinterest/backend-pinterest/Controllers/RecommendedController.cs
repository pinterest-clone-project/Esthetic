using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Models.DTO;
using Application.Models.DTO.Pin;
using Application.UseCases.Recommended.Command;
using Application.UseCases.Recommended.Query;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RecommendedController(IMediator mediator) : ControllerBase
{
    private Guid CurrentUserId =>
    Guid.TryParse(User.FindFirstValue(JwtClaims.Id), out var id) ? id : Guid.Empty;

    [Authorize]
    [HttpPost("track-view/{pinId}")]
    public async Task<IActionResult> TrackView([FromRoute] Guid pinId)
    {
        var command = new TrackPinViewCommand
        {
            UserId = CurrentUserId,
            PinId = pinId
        };

        var result = await mediator.Send(command);
        return Ok(result);

    }
    [HttpGet("recommended")]
    public async Task<PagedResult<PinSummaryDTO>> GetRecommended(
    [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] int seed = 0)
    {
        var query = new GetRecommendedPinsQuery(CurrentUserId, page, pageSize, seed);
        return await mediator.Send(query);
    }
}
