using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record GetDeletedPinsQuery(Guid UserId) : IRequest<List<PinSummaryDTO>>;
