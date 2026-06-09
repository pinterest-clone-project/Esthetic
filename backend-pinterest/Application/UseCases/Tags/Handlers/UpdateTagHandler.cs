using Application.Common.Exceptions;
using Application.Common.Validators;
using Application.Mappers;
using Application.UseCases.Tags.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class UpdateTagHandler(
    ITagRepository repository,
    TagMapper tagMapper) : IRequestHandler<UpdateTagCommand, Unit>
{
    public async Task<Unit> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await repository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(ValidationMessages.NotFound(ValidationMessages.Tag));

        tagMapper.Patch(request, tag);
        await repository.UpdateAsync(tag);
        return Unit.Value;
    }
}