
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Queries;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class GetTagByIdHandler(ITagRepository repository,
    IMapper mapper) : IRequestHandler<GetTagByIdQuery, TagDTO?>
{
    public async Task<TagDTO> Handle(GetTagByIdQuery request, CancellationToken cancellationToken)
    {
        var tag = await repository.GetByIdAsync(request.id);
        if (tag == null) return null;
        return mapper.Map<TagDTO>(tag);
    }
}
