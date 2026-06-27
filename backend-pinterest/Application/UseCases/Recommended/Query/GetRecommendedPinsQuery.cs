using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Recommended.Query;

public record GetRecommendedPinsQuery(Guid UserId) : IRequest<List<PinSummaryDTO>>
{
}
