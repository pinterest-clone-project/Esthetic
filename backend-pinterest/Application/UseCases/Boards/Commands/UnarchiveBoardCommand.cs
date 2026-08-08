using MediatR;

namespace Application.UseCases.Boards.Commands;

public record UnarchiveBoardCommand(Guid Id, Guid OwnerId) : IRequest<Unit>;
