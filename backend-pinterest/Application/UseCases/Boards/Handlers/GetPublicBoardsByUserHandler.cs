using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class GetPublicBoardsByUserHandler(
    IBoardRepository boardRepository,
    IPagedService pagedService) : IRequestHandler<GetPublicBoardsByUserQuery, PagedResult<BoardListItemDTO>>
{
    public async Task<PagedResult<BoardListItemDTO>> Handle(
        GetPublicBoardsByUserQuery request,
        CancellationToken cancellationToken)
    {
        var query = boardRepository.GetQueryable()
            .Where(b => b.OwnerId == request.UserId
                     && !b.IsPrivate
                     && !b.IsArchived)
            .OrderByDescending(b => b.CreatedAt);

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
