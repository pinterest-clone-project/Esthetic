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
    [HttpGet("getAll")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetAll()
    {
        var users = await mediator.Send(new GetAllUsersQuery());
        return Ok(users);
    }

    [HttpGet("getById/{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var user = await mediator.Send(new GetUserByIdQuery(id));
        return Ok(user);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchUsersQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("create")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand command)
    {
        var user = await mediator.Send(command);
        return Ok(user);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateUserCommand command)
    {
        var commandWithId = command with { Id = id };
        var user = await mediator.Send(commandWithId);
        return Ok(user);
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteUserCommand(id));
        return NoContent();
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