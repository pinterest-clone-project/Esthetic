
using Application.Mappers;
using Application.Models.DTO.Pin;
using Application.UseCases.Recommended.Query;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Recommended.Handler;

public class GetRecommendedPinsHandler(
    IRecommendedRepository recommendedRepository,
    IPinRepository pinRepository,
    IUserBlockRepository userBlockRepository,
    PinMapper pinMapper) : IRequestHandler<GetRecommendedPinsQuery, List<PinSummaryDTO>>
{
    public async Task<List<PinSummaryDTO>> Handle(GetRecommendedPinsQuery request, CancellationToken ct)
    {
        var blockedIds = request.UserId != Guid.Empty
            ? await userBlockRepository.GetBlockedUserIdsAsync(request.UserId, ct)
            : new List<Guid>();

        if (request.UserId == Guid.Empty)
        {
            return await GetRandom(blockedIds, ct);
        }
        else
        {
            var userPinsInteractions = await recommendedRepository.GetAllByUserAsync(request.UserId);
            if (userPinsInteractions.Count < 10)
                return await GetRandom(blockedIds, ct);

            var pinIds = userPinsInteractions
                .OrderByDescending(x => x.ViewCount)
                .ThenByDescending(x => x.LastViewedAt)
                .Take(30)
                .Select(x => x.PinId)
                .ToList();

            var tagIds = await pinRepository.GetTagIdsByPinIdsAsync(pinIds, ct);
            var recommendedPins = await pinRepository.GetAllWithDetailsAsync(ct);

            recommendedPins = recommendedPins
                .Where(p => p.PinTags!.Any(t => tagIds.Contains(t.TagId)))
                .Where(p => !blockedIds.Contains(p.CreatorId))  // filter blocked
                .ToList();

            return recommendedPins.Select(p => pinMapper.ToSummaryDto(p, request.UserId)).ToList();
        }
    }

    private async Task<List<PinSummaryDTO>> GetRandom(List<Guid> blockedIds, CancellationToken ct)
    {
        var pins = await pinRepository.GetAllWithDetailsAsync(ct);
        return pins
            .Where(p => !blockedIds.Contains(p.CreatorId))  // filter blocked even for anonymous
            .Take(20)
            .Select(p => pinMapper.ToSummaryDto(p, Guid.Empty))
            .ToList();
    }
}
