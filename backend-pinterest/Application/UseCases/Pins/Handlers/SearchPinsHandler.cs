using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO;
using Application.Models.DTO.Pin;
using Application.UseCases.Pins.Extensions;
using Application.UseCases.Pins.Queries;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Pins.Handlers;

public class SearchPinsHandler(
    IPinRepository pinRepository,
    IPagedService pagedService,
    PinMapper pinMapper) : IRequestHandler<SearchPinsQuery, PagedResult<PinSummaryDTO>>
{
    public async Task<PagedResult<PinSummaryDTO>> Handle(SearchPinsQuery request, CancellationToken cancellationToken)
    {
        var query = pinRepository.GetQueryable()
            .Include(p => p.PinTags)!.ThenInclude(pt => pt.Tag)
            .Include(p => p.Category)
            .Include(p => p.Creator)
            .Include(p => p.Likes)
            .ApplyFilters(request)
            .ApplySorting(request);

        return await pagedService.GetPagedAsync(
            query,
            p => pinMapper.ToSummaryDto(p, request.CurrentUserId),
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
