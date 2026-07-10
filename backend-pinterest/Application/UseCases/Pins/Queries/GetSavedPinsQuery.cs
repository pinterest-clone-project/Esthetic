using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record GetSavedPinsQuery(Guid UserId) : IRequest<List<PinSummaryDTO>>;
