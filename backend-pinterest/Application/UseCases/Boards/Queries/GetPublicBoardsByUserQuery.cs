using Application.Models.DTO;
using Application.Models.DTO.Board;
using MediatR;

namespace Application.UseCases.Boards.Queries;

public record GetPublicBoardsByUserQuery : IRequest<PagedResult<BoardListItemDTO>>
{
    public Guid UserId { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
