using Application.Models.DTO;
using Application.Models.DTO.Board;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.UseCases.Boards.Queries;

public record GetUserBoardsQuery : IRequest<PagedResult<BoardListItemDTO>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public bool IncludeArchived { get; init; } = false;

    [BindNever]
    public Guid OwnerId { get; init; }
}