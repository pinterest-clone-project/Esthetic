using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;
public record GetAllPinsQuery : IRequest<List<PinSummaryDTO>>;
