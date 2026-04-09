
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class GetAllTagsHandler : IRequestHandler<GetAllTagsQuery, List<TagDTO>>
{
    private readonly ITagRepository _repo;
    private readonly IMapper _mapper;

    public GetAllTagsHandler(ITagRepository repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);
    
    public async Task<List<TagDTO>> Handle(GetAllTagsQuery query, CancellationToken cancellationToken)
    {
        var tags = await _repo.GetAllAsync();
        return _mapper.Map<List<TagDTO>>(tags);
    }
}
