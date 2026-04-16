
using Application.UseCases.Tags.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class DeleteTagHandler(ITagRepository repository) : IRequestHandler<DeleteTagCommand, Unit>
{
    public async Task<Unit> Handle(DeleteTagCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.id, cancellationToken);
        return Unit.Value;
    }
}
