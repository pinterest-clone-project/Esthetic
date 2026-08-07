

using Application.Models.DTO.Pin;
using MediatR;

namespace Application.UseCases.Pins.Queries;

public record GetPinSavedLocationQuery(Guid PinId, Guid UserId) :
    IRequest<List<SavedPinLocationDTO>>;