using MediatR;

namespace Application.UseCases.Pins.Queries;
public record GetPinSavedBoardsQuery(Guid PinId, Guid UserId) : IRequest<List<Guid>>;
