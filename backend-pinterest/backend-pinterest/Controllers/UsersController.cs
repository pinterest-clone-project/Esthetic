using Application.UseCases.Users.Commands;
using Application.UseCases.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.UseCases.Users.Requests;

namespace backend_pinterest.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        var user = await _mediator.Send(new CreateUserCommand(request));
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _mediator.Send(new GetAllUsersQuery());
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _mediator.Send(new GetUserByIdQuery(id));
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        await _mediator.Send(new UpdateUserCommand(id, request));
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand(id));
        return NoContent();
    }
}
