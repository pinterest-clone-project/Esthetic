using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.Board;
using Application.UseCases.Boards.Extensions;
using Application.UseCases.Boards.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Boards.Handlers;

public class SearchBoardsHandler(
    IBoardRepository boardRepository,
    IPagedService pagedService) : IRequestHandler<SearchBoardsQuery, PagedResult<BoardDTO>>
{
    public async Task<PagedResult<BoardDTO>> Handle(SearchBoardsQuery request, CancellationToken cancellationToken)
    {
        var query = boardRepository.GetQueryable()
            .ApplyFilters(request)
            .ApplySorting(request);

        return await pagedService.GetPagedAsync(
            query,
            b => new BoardDTO
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                CoverImageUrl = b.CoverImageUrl,
                IsPrivate = b.IsPrivate,
                IsArchived = b.IsArchived,
                OwnerId = b.OwnerId,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                PinsCount = b.BoardPins.Count(bp => !bp.IsDeleted)
            },
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
