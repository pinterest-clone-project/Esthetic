using Application.Models.DTO;
using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Recommended.Query;

public record GetRecommendedPinsQuery(Guid UserId, int Page = 1, int PageSize = 20, int Seed = 0) : IRequest<PagedResult<PinSummaryDTO>>;