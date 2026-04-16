
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class CreateTagHandler(
    ITagRepository repository, IMapper mapper) : IRequestHandler<CreateTagCommand, TagDTO> 
{
    public async Task<TagDTO> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = mapper.Map<TagEntity>(request);
        var created = await repository.AddAsync(tag);
        return mapper.Map<TagDTO>(created);
    }
}
