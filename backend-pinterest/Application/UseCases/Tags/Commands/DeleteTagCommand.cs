
using MediatR;

namespace Application.UseCases.Tags.Commands;

public record DeleteTagCommand(Guid id) : IRequest<Unit>;
