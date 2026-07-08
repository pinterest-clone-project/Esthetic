using Application.Interfaces;
using Application.Models.DTO;
using Application.Models.DTO.Tag;
using Application.UseCases.Tags.Extensions;
using Application.UseCases.Tags.Queries;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.Tags.Handlers;

public class SearchTagsHandler(
    ITagRepository tagRepository,
    IPagedService pagedService) : IRequestHandler<SearchTagsQuery, PagedResult<TagDTO>>
{
    public async Task<PagedResult<TagDTO>> Handle(SearchTagsQuery request, CancellationToken cancellationToken)
    {
        var q = tagRepository.GetQueryable()
            .ApplyFilters(request)
            .ApplySorting(request);

        return await pagedService.GetPagedAsync(
            q,
            t => new TagDTO
            {
                Id = t.Id,
                Name = t.Name,
                PinsCount = t.PinTags!.Count
            },
            request.Page,
            request.PageSize,
            cancellationToken
        );
    }
}
