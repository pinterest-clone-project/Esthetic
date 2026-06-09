using Application.Mappers;
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class CreateTagHandler(
    ITagRepository repository,
    TagMapper tagMapper) : IRequestHandler<CreateTagCommand, TagDTO>
{
    public async Task<TagDTO> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = tagMapper.ToEntity(request);
        var created = await repository.AddAsync(tag);
        return tagMapper.ToDto(created);
    }
}