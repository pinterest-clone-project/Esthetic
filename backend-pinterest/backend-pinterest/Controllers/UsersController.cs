using Application.UseCases.Users.Commands;
using Application.UseCases.Users.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_pinterest.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IMediator mediator) : ControllerBase
{
    [HttpPost("create")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand request)
    {
        var user = await mediator.Send(request);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var users = await mediator.Send(new GetAllUsersQuery());
        return Ok(users);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await mediator.Send(new GetUserByIdQuery(id));
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserCommand request)
    {
        var command = request with { Id = id };
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteUserCommand(id));
        return NoContent();
    }
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchUsersQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPut("block/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Block([FromRoute] Guid id, [FromBody] AdminBlockUserRequest request)
    {
        var user = await mediator.Send(new AdminBlockUserCommand(id, request.Reason));
        return Ok(user);
    }

    [HttpPut("unblock/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Unblock([FromRoute] Guid id)
    {
        var user = await mediator.Send(new AdminUnblockUserCommand(id));
        return Ok(user);
    }
}
public record AdminBlockUserRequest(string Reason);