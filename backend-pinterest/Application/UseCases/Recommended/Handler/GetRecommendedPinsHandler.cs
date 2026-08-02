
using Application.Interfaces;
using Application.Mappers;
using Application.Models.DTO;
using Application.Models.DTO.Pin;
using Application.UseCases.Recommended.Query;
using Domain.Entities.Pin;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.UseCases.Recommended.Handler;

public class GetRecommendedPinsHandler(
    IRecommendedRepository recommendedRepository,
    IPinRepository pinRepository,
    IPagedService pagedService,
    PinMapper pinMapper) : IRequestHandler<GetRecommendedPinsQuery, PagedResult<PinSummaryDTO>>
{
    public async Task<PagedResult<PinSummaryDTO>> Handle(GetRecommendedPinsQuery request, CancellationToken ct)
    {
        var personalizedQuery = await BuildPersonalizedQuery(request.UserId, ct);
        var personalizedIds = await personalizedQuery.Select(p => p.Id).ToListAsync(ct);

        var randomPoolIds = await pinRepository.GetQueryable()
            .Where(p => !personalizedIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync(ct);

        var fullPoolIds = personalizedIds.Concat(randomPoolIds).ToList();
        if (fullPoolIds.Count == 0)
            return new PagedResult<PinSummaryDTO> { Items = [], TotalCount = 0, Page = request.Page, PageSize = request.PageSize };

        var skip = (request.Page - 1) * request.PageSize;

        var cycle = skip / fullPoolIds.Count;
        var offsetInCycle = skip % fullPoolIds.Count;

        var shuffledForCycle = ShuffleDeterministic(fullPoolIds, request.Seed + cycle);

        var pageIds = new List<Guid>();
        var remaining = request.PageSize;
        var pos = offsetInCycle;
        var currentCycle = cycle;
        var currentShuffled = shuffledForCycle;

        while (remaining > 0)
        {
            var available = currentShuffled.Count - pos;
            var take = Math.Min(available, remaining);
            pageIds.AddRange(currentShuffled.Skip(pos).Take(take));
            remaining -= take;

            if (remaining > 0)
            {
                currentCycle++;
                currentShuffled = ShuffleDeterministic(fullPoolIds, request.Seed + currentCycle);
                pos = 0;
            }
        }

        var entities = await ApplyIncludes(pinRepository.GetQueryable())
            .Where(p => pageIds.Contains(p.Id))
            .ToListAsync(ct);

        var ordered = pageIds.Select(id => entities.First(e => e.Id == id)).ToList();

        return new PagedResult<PinSummaryDTO>
        {
            Items = ordered.Select(p => pinMapper.ToSummaryDto(p, request.UserId)).ToList(),
            TotalCount = int.MaxValue,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
    private static List<Guid> ShuffleDeterministic(List<Guid> source, int seed)
    {
        var rng = new Random(seed);
        var list = new List<Guid>(source);
        for (var i = list.Count - 1; i > 0; i--)
        {
            var j = rng.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
        return list;
    }

    private static IQueryable<PinEntity> ApplyIncludes(IQueryable<PinEntity> q) => q
        .Include(p => p.PinTags!).ThenInclude(pt => pt.Tag)
        .Include(p => p.Category)
        .Include(p => p.Creator)
        .Include(p => p.Likes)
        .Include(p => p.Comments);

    private async Task<IQueryable<PinEntity>> BuildPersonalizedQuery(Guid userId, CancellationToken ct)
    {
        var baseQuery = ApplyIncludes(pinRepository.GetQueryable());

        if (userId == Guid.Empty) return baseQuery.Where(p => false); 

        var userPinsInteractions = await recommendedRepository.GetAllByUserAsync(userId);
        if (userPinsInteractions.Count < 10) return baseQuery.Where(p => false);

        var pinIds = userPinsInteractions
            .OrderByDescending(x => x.ViewCount)
            .ThenByDescending(x => x.LastViewedAt)
            .Take(30).Select(x => x.PinId).ToList();

        var tagIds = await pinRepository.GetTagIdsByPinIdsAsync(pinIds, ct);

        return baseQuery.Where(p => p.PinTags!.Any(t => tagIds.Contains(t.TagId)));
    }
}