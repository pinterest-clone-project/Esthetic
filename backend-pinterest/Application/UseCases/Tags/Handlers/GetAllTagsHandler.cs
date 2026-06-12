using Application.Mappers;
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class GetAllTagsHandler(
    ITagRepository repository,
    TagMapper tagMapper) : IRequestHandler<GetAllTagsQuery, List<TagDTO>>
{
    public async Task<List<TagDTO>> Handle(GetAllTagsQuery query, CancellationToken cancellationToken)
    {
        var tags = await repository.GetAllAsync();
        return tags.Select(tagMapper.ToDto).ToList();
    }
}