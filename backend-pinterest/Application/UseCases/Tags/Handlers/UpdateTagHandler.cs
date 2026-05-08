
using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.UseCases.Tags.Commands;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class UpdateTagHandler(ITagRepository repository,
    IMapper mapper) : IRequestHandler<UpdateTagCommand, Unit>
{
    public async Task<Unit> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await repository.GetByIdAsync(request.Id);
        if (tag == null) throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Tag));
        mapper.Map(request, tag);
        await repository.UpdateAsync(tag);
        return Unit.Value;
    }
}
