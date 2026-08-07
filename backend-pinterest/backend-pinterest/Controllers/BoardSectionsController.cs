
using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.BoardSections.Commands;
using Application.UseCases.BoardSections.Queries;
using Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_pinterest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BoardSectionsController(IMediator mediator) : ControllerBase
    {
        private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(JwtClaims.Id)
        ?? throw new UnauthorizedException(ValidationMessages.ErrorUnauthorized));

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateBoardSectionCommand command)
        {
            var commandWithOwner = command with
            {
                OwnerId = CurrentUserId
            };

            var result = await mediator.Send(commandWithOwner);

            return Ok(result);
        }

        [HttpGet("getById/{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await mediator.Send(
                new GetBoardSectionByIdQuery(id, CurrentUserId));

            return Ok(result);
        }

        [HttpGet("byBoard/{boardId:guid}")]
        public async Task<IActionResult> GetByBoard(Guid boardId)
        {
            var result = await mediator.Send(
                new GetBoardSectionsQuery(boardId, CurrentUserId));

            return Ok(result);
        }

        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await mediator.Send(new DeleteBoardSectionCommand
            {
                Id = id,
                OwnerId = CurrentUserId
            });

            return NoContent();
        }

        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateBoardSectionCommand command)
        {
            var commandWithIds = command with
            {
                Id = id,
                OwnerId = CurrentUserId
            };

            var result = await mediator.Send(commandWithIds);

            return Ok(result);
        }

    }
}
