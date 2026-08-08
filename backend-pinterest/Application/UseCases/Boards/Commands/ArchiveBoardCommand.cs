using MediatR;

namespace Application.UseCases.Boards.Commands;

public record ArchiveBoardCommand(Guid Id, Guid OwnerId) : IRequest<Unit>;
