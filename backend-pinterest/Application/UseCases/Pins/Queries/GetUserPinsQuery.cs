using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record GetUserPinsQuery(Guid UserId, Guid CurrentUserId = default) : IRequest<List<PinSummaryDTO>>;
