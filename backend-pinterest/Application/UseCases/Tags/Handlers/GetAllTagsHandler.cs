
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class GetAllTagsHandler(ITagRepository repository, IMapper mapper) : IRequestHandler<GetAllTagsQuery, List<TagDTO>>
{
    public async Task<List<TagDTO>> Handle(GetAllTagsQuery query, CancellationToken cancellationToken)
    {
        var tags = await repository.GetAllAsync();
        return mapper.Map<List<TagDTO>>(tags);
    }
}
