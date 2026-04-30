using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class GetUserBoardsHandler(
    IBoardRepository boardRepository,
    IPagedService pagedService) : IRequestHandler<GetUserBoardsQuery, PagedResult<BoardListItemDTO>>
{
    public async Task<PagedResult<BoardListItemDTO>> Handle(
        GetUserBoardsQuery request,
        CancellationToken cancellationToken)
    {
        var query = boardRepository.GetQueryable()
            .Where(b => b.OwnerId == request.OwnerId);

        if (!request.IncludeArchived)
        {
            query = query.Where(b => !b.IsArchived);
        }

        query = query.OrderByDescending(b => b.CreatedAt);

        return await pagedService.GetPagedAsync(
            query,
            b => new BoardListItemDTO
            {
                Id = b.Id,
                Title = b.Title,
                CoverImageUrl = b.CoverImageUrl,
                IsPrivate = b.IsPrivate,
                IsArchived = b.IsArchived,
                PinsCount = b.BoardPins.Count(bp => !bp.IsDeleted),
                CreatedAt = b.CreatedAt
            },
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}