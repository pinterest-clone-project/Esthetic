
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class CreateTagHandler : IRequestHandler<CreateTagCommand, TagDTO> 
{
    private readonly ITagRepository _repo;
    private readonly IMapper _mapper;

    public CreateTagHandler(ITagRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

    public async Task<TagDTO> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var tag = _mapper.Map<TagEntity>(request.Model);
        var created = await _repo.AddAsync(tag);
        return _mapper.Map<TagDTO>(created);
    }
}
