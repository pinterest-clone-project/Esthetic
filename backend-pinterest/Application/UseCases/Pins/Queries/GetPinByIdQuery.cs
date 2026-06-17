using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record GetPinByIdQuery(Guid Id, Guid? CurrentUserId = null) : IRequest<PinDTO?>;
